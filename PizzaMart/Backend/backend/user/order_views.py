from decimal import Decimal

from django.conf import settings
from django.db import transaction
from django.shortcuts import get_object_or_404


from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated
from rest_framework import status

from user .models import Cart,CartItems,Order,OrderItems,Payment

from .razorpay_utils import get_razorpay_client

def order_to_dict(order):

    items = []

    for item in order.items.all():
        items.append({
            "id":item.id,
            "pizza_id":item.pizzas_id,
            "name":item.pizza_name,
            "price":float(item.unit_price),
            "quantity":item.quantity,
            "subtotal":float(item.subtotal)
        })
    return {
        "id": order.id,
        "order_number": order.order_number,
        "delivery_name": order.delivery_name,
        "phone": order.delivery_phone,
        "address": order.delivery_address,
        "city": order.delivery_city,
        "state": order.delivery_state,
        "pincode": order.delivery_pincode,
        "subtotal": float(order.subtotal),
        "delivery_fee": float(order.delivery_fee),
        "total_amount": float(order.total_amount),
        "payment_method": order.payment_method,
        "payment_status": order.payment_status,
        "status": order.status,
        "created_at": order.created_at,
        "items": items,
    }

class CheckoutAPIView(APIView):
    permission_classes = [IsAuthenticated]

    def post(self, request):

        user = request.user

        # 1. Get delivery details
        delivery_name = request.data.get("delivery_name", "").strip()
        delivery_phone = request.data.get("phone", "").strip()
        delivery_address = request.data.get("address", "").strip()
        delivery_city = request.data.get("city", "").strip()
        delivery_state = request.data.get("state", "").strip()
        delivery_pincode = request.data.get("pincode", "").strip()

        payment_method = request.data.get(
            "payment_method", ""
        ).strip().lower()

        # 2. Validate required fields
        required_fields = {
            "delivery_name": delivery_name,
            "phone": delivery_phone,
            "address": delivery_address,
            "city": delivery_city,
            "state": delivery_state,
            "pincode": delivery_pincode,
        }

        missing_fields = [
            field for field, value in required_fields.items()
            if not value
        ]

        if missing_fields:
            return Response({
                "error": "Please fill in all delivery details",
                "fields": missing_fields
            }, status=status.HTTP_400_BAD_REQUEST)

        if not delivery_phone.isdigit() or not (10 <= len(delivery_phone) <= 15):
            return Response({
                "error": "Enter a valid phone number."
            }, status=status.HTTP_400_BAD_REQUEST)

        if not delivery_pincode.isdigit() or len(delivery_pincode) != 6:
            return Response({
                "error": "Enter a valid 6-digit PIN code."
            }, status=status.HTTP_400_BAD_REQUEST)

        if payment_method not in ["razorpay", "cod"]:
            return Response({
                "error": "Invalid payment method."
            }, status=status.HTTP_400_BAD_REQUEST)

        # 3. Get logged-in user's cart
        try:
            cart = Cart.objects.get(user=user)
        except Cart.DoesNotExist:
            return Response({
                "error": "Your cart is empty."
            }, status=status.HTTP_400_BAD_REQUEST)

        cart_list = list(
            CartItems.objects.filter(
                cart=cart,
                user=user
            ).select_related("pizzas")
        )

        if not cart_list:
            return Response({
                "error": "Your cart is empty."
            }, status=status.HTTP_400_BAD_REQUEST)

        # 4. Calculate subtotal
        subtotal = sum(
            (
                Decimal(str(item.pizzas.price)) * item.quantity
                for item in cart_list
            ),
            Decimal("0.00")
        )

        delivery_fee = Decimal("0.00")
        total_amount = subtotal + delivery_fee

        # 5. Create order and order items
        with transaction.atomic():

            order = Order.objects.create(
                 user=user,
                delivery_name=delivery_name,
                delivery_phone=delivery_phone,
                delivery_address=delivery_address,
                delivery_city=delivery_city,
                delivery_state=delivery_state,
                delivery_pincode=delivery_pincode,
                subtotal=subtotal,
                delivery_fee=delivery_fee,
                total_amount=total_amount,
                payment_method=payment_method,
                payment_status="pending",
                 status="confirmed" if payment_method == "cod" else "pending"
            )

            for item in cart_list:

                price = Decimal(str(item.pizzas.price))
                item_subtotal = price * item.quantity

                OrderItems.objects.create(
                    order=order,
                    pizzas=item.pizzas,
                    pizza_name=item.pizzas.name,
                    unit_price=price,
                    quantity=item.quantity,
                    subtotal=item_subtotal,
                    
                )

            # Create ONE payment record for the entire order
            payment = Payment.objects.create(
                order=order,
                payment_method=payment_method,
                amount=total_amount,
                status="pending"
            )

            purchased_cart_ids = [item.id for item in cart_list]

            # 6. COD checkout
            if payment_method == "cod":

                CartItems.objects.filter(
                    id__in=purchased_cart_ids,
                    user=user,
                    cart=cart
                ).delete()

                return Response({
                    "message": "Order placed successfully.",
                    "order": order_to_dict(order)
                }, status=status.HTTP_201_CREATED)

        # 7. Razorpay checkout (only one gateway order per PizzaMart order)
        try:

            client = get_razorpay_client()

            razorpay_order = client.order.create(data={
                "amount": int(total_amount * 100),
                "currency": "INR",
                "receipt": order.order_number,
                "notes": {
                    "pizza_order_number": order.order_number,
                    "customer_id": str(user.id)
                }
            })

            order.razorpay_order_id = razorpay_order["id"]
            order.save(update_fields=["razorpay_order_id", "updated_at"])

            return Response({
                "message": "Payment order created",
                "order": order_to_dict(order),
                "razorpay": {
                    "key": settings.RAZORPAY_KEY_ID,
                    "razorpay_order_id": razorpay_order["id"],
                    "amount": razorpay_order["amount"],
                    "currency": razorpay_order["currency"]
                }
            }, status=status.HTTP_201_CREATED)

        except Exception as e:

            payment.status = "failed"
            payment.save(update_fields=["status"])

            return Response({
                "error": "Unable to start online payment. Please try again.",
                "order": order.order_number
            }, status=status.HTTP_502_BAD_GATEWAY)
        # except Exception as e:
        #     print("RAZORPAY ERROR:", repr(e))

        #     payment.status = "failed"
        #     payment.save(update_fields=["status"])

        #     return Response({
        #     "error": "Unable to start online payment.",
        #     "details": str(e),
        #     "order": order.order_number
        # }, status=status.HTTP_502_BAD_GATEWAY)


class VerifyRazorpayPaymentAPIView(APIView):
    permission_classes = [IsAuthenticated]

    def post(self,request):

        order_number = request.data.get("order_number")
        razorpay_order_id = request.data.get("razorpay_order_id")
        razorpay_payment_id = request.data.get("razorpay_payment_id")
        razorpay_signature = request.data.get("razorpay_signature")

        if not all([
            order_number,
            razorpay_order_id,
            razorpay_payment_id,
            razorpay_signature
        ]):
            return Response({
                "error":"Payment verification details are missing"
            },status=status.HTTP_400_BAD_REQUEST)


        order = get_object_or_404(
            Order,
            order_number=order_number,
            user = request.user,
            payment_method = 'razorpay'
        )

        if order.payment_method == "paid":
            return Response({
                "message":"Payment already verified",
                "order":order_to_dict(order)
            },status=status.HTTP_200_OK)

        if order.razorpay_order_id != razorpay_order_id:
            return Response({
                "error":"Razorpay order does not match."
            },status=status.HTTP_400_BAD_REQUEST)

        try:
            client = get_razorpay_client()

            client.utility.verify_payment_signature({
                "razorpay_order_id": razorpay_order_id,
                "razorpay_payment_id": razorpay_payment_id,
                "razorpay_signature": razorpay_signature,
            })

            gateway_payment = client.payment.fetch(razorpay_payment_id)

            if gateway_payment.get("order_id") != order.razorpay_order_id:
                return Response({
                    "error":"Payment order does not match"
                },status=status.HTTP_400_BAD_REQUEST)

            expected_amount = int(order.total_amount * 100)

            if int(gateway_payment.get("amount", 0)) != expected_amount:
                return Response({
                    "error": "Payment amount does not match"
                }, status=status.HTTP_400_BAD_REQUEST)

            # Only captured payments are marked as paid
            if gateway_payment.get("status") != "captured":
                return Response({
                    "message": "Payment is not captured yet",
                    "payment_status": gateway_payment.get("status")
                }, status=status.HTTP_202_ACCEPTED)

            with transaction.atomic():

                order = Order.objects.select_for_update().get(
                    id=order.id,
                    user=request.user
                )

                if order.payment_status != "paid":

                    payment = order.payments.filter(
                        payment_method="razorpay"
                    ).latest("created_at")

                    payment.transaction_id = razorpay_payment_id
                    payment.status = "success"
                    payment.save()

                    order.payment_status = "paid"
                    order.status = "confirmed"
                    order.save(update_fields=[
                        "payment_status",
                        "status",
                        "updated_at"
                    ])

                    # Remove only the cart rows purchased in this order.
                    purchased_ids = list(
                        order.items.exclude(
                            cart_item_id__isnull=True
                        ).values_list("cart_item_id", flat=True)
                    )

                    CartItems.objects.filter(
                        id__in=purchased_ids,
                        user=request.user
                    ).delete()

            return Response({
                "message": "Payment successful",
                "order": order_to_dict(order)
            }, status=status.HTTP_200_OK)

        except Exception:
            return Response({
                "error": "Payment verification failed. Please contact support if money was deducted."
            }, status=status.HTTP_400_BAD_REQUEST)


class MyOrdersAPIView(APIView):

    permission_classes = [IsAuthenticated]

    def get(self, request):

        orders = Order.objects.filter(
            user=request.user
        ).prefetch_related("items").order_by("-created_at")

        data = [
            order_to_dict(order)
            for order in orders
        ]

        return Response({
            "orders": data
        }, status=status.HTTP_200_OK)


class OrderDetailAPIView(APIView):

    permission_classes = [IsAuthenticated]

    def get(self, request, order_number):

        order = get_object_or_404(
            Order.objects.prefetch_related("items"),
            order_number=order_number,
            user=request.user
        )

        return Response({
            "order": order_to_dict(order)
        }, status=status.HTTP_200_OK)



            
                

        