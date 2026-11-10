from django.contrib.auth import get_user_model
from rest_framework.permissions import IsAdminUser,IsAuthenticated
from rest_framework.generics import ListAPIView
from .serializers import *
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from django.conf import settings
from rest_framework.permissions import AllowAny
from rest_framework_simplejwt.authentication import JWTAuthentication
from  rest_framework_simplejwt.tokens import RefreshToken,AccessToken
from datetime import timedelta
from user.models import Pizzas,Category,Order,OrderItems
from django.db.models import Sum,Count
from django.db.models.functions import TruncDate
import secrets
from rest_framework import viewsets
from datetime import datetime
User = get_user_model()
class AdminLoginView(APIView):
    authentication_classes = []
    permission_classes = [AllowAny]


    def post(self,request):
        email = request.data.get("email").strip()
        password = request.data.get("password")

        if not email or not password:
            return Response({
                "error":"Email and password required"
            },status=status.HTTP_400_BAD_REQUEST)
        admin_email = settings.PIZZAMART_ADMIN_EMAIL
        admin_password = settings.PIZZAMART_ADMIN_PASSWORD
        email_valid = secrets.compare_digest(email.lower(),admin_email.strip().lower())
        password_valid = secrets.compare_digest(password,admin_password)


        if not email_valid or not password_valid : 
            return Response({
                "message":"Invalid admin email or password"
            },status=status.HTTP_401_UNAUTHORIZED)
        User = get_user_model()
        admin_user = User.objects.filter(username = "admin",is_staff = True,is_superuser = True,is_active = True).first()
        if not admin_user:
            return Response({
                "error":"Admin Django user not found"
            },status=status.HTTP_403_FORBIDDEN)
        refresh = RefreshToken.for_user(admin_user)

        access_token = refresh.access_token
        access_token["admin"] = True
        access_token["admin_email"] = email
        return Response({
            "message":"Admin login successful",
            "access": str(access_token),
            "refresh":str(refresh),
            "email":email
        },status=status.HTTP_200_OK)

#  USer display on the admin Get all user

class AdminUserListView(APIView):

    authentication_classes = [JWTAuthentication]
    permission_classes = [IsAdminUser]

    def get(self,request):
        customer = User.objects.filter(
            is_staff= False,
            is_superuser = False
        ).order_by("-date_joined")
        serializer = AdminUserSerializers(customer,many = True)
        return Response({
            "users": serializer.data
        }, status=status.HTTP_200_OK)

#  Patch and delte user 
class AdminUserDetailView(APIView):
    permission_classes=[IsAdminUser]
    authentication_classes = [JWTAuthentication]
    def get_customer(self,pk):

        try:
            return User.objects.get(
                pk=pk,
                is_staff = False,
                is_superuser = False
            )
        except User.DoesNotExist:
            return None

        # Block USer

    def patch(self,request,pk):

        customer = self.get_customer(pk)
        if customer is None:
            return Response({
                "error":"Customer not found."
            },status=status.HTTP_404_NOT_FOUND)

        is_active = request.data.get('is_active')

        if not isinstance(is_active,bool):
            return Response({
                "error":"is_active must be true or false"
            },status=status.HTTP_400_BAD_REQUEST)
        customer.is_active = is_active
        customer.save(update_fields=['is_active'])

        return Response({
            "message":("Customer unbloked successfully"
            if is_active
            else "Coustomer blocked successfully."),
            "user":AdminUserSerializers(customer).data
        },status=status.HTTP_200_OK)

    #  Delete Coustomer

    def delete(self,request,pk):
        customer = self.get_customer(pk)

        if customer is None :
            return Response({
                "error":"Coustomer is not found."
            },status=status.HTTP_404_NOT_FOUND)
        customer.delete()
        return Response({
            "message" :"Coustomer removed successfully."
        },status=status.HTTP_200_OK)



#  Admin DashBoard


class AdminDashboardView(APIView):

    def get(self, request):

        try:
            days = int(request.query_params.get("days", 7))
        except (TypeError, ValueError):
            days = 7

        if days not in [7, 30, 90]:
            days = 7

        today = timezone.localdate()
        start_date = today - timedelta(days=days - 1)

        start_datetime = timezone.make_aware(
            datetime.combine(start_date, datetime.min.time())
        )

        # 1. Dashboard summary
        total_orders = Order.objects.count()

        revenue = (
            Order.objects
            .exclude(status__iexact="cancelled")
            .aggregate(total=Sum("total_amount"))
        )

        total_revenue = revenue["total"] or 0

        total_customer = User.objects.filter(
            is_staff=False,
            is_superuser=False
        ).count()

        pending_order = Order.objects.filter(
            status__iexact="pending"
        ).count()

        # 2. Sales overview
        sale_queryset = (
            Order.objects
            .filter(created_at__gte=start_datetime)
            .exclude(status__iexact="cancelled")
            .annotate(sale_date=TruncDate("created_at"))
            .values("sale_date")
            .annotate(sales=Sum("total_amount"))
            .order_by("sale_date")
        )

        sale_overview = [
            {
                "date": item["sale_date"].isoformat(),
                "sales": float(item["sales"] or 0)
            }
            for item in sale_queryset
        ]

        # 3. Order status
        status_queryset = (
            Order.objects
            .values("status")
            .annotate(count=Count("id"))
            .order_by("status")
        )

        order_status = [
            {
                "status": item["status"].replace("_", " ").title(),
                "count": item["count"]
            }
            for item in status_queryset
        ]

        # 4. Popular pizzas
        popular_queryset = (
            OrderItems.objects
            .filter(pizzas__isnull=False)
            .exclude(order__status__iexact="cancelled")
            .values(
                "pizzas_id",
                "pizza_name",
                "unit_price",
                "pizzas__image"
            )
            .annotate(order=Sum("quantity"))
            .order_by("-order")[:5]
        )

        popular_pizzas = []

        for item in popular_queryset:

            image_url = item["pizzas__image"]

            if image_url:
                try:
                    image_url = request.build_absolute_uri(
                        f"/media/{image_url}"
                    )
                except (AttributeError, ValueError):
                    image_url = None

            popular_pizzas.append({
                "id": item["pizzas_id"],
                "name": item["pizza_name"],
                "order": item["order"] or 0,
                "price": float(item["unit_price"] or 0),
                "image": image_url
            })

        # 5. Recent orders
        recent_queryset = (
            Order.objects
            .select_related("user")
            .order_by("-created_at")[:5]
        )

        recent_orders = []

        for order in recent_queryset:

            items_count = (
                OrderItems.objects
                .filter(order=order)
                .aggregate(total=Sum("quantity"))["total"] or 0
            )

            recent_orders.append({
                "id": order.pk,
                "customer_name": (
                    order.user.get_full_name() or order.user.username
                ),
                "items_count": items_count,
                "total_amount": float(order.total_amount or 0),
                "status": order.status.replace("_", " ").title()
            })

        # 6. Top categories
        category_queryset = (
            OrderItems.objects
            .filter(
                pizzas__isnull=False,
                pizzas__category__isnull=False
            )
            .exclude(order__status__iexact="cancelled")
            .values(
                "pizzas__category_id",
                "pizzas__category__name"
            )
            .annotate(order=Sum("quantity"))
            .order_by("-order")
        )

        top_categories = []

        max_category_order = max(
            [item["order"] or 0 for item in category_queryset],
            default=0
        )

        for item in category_queryset[:5]:

            count = item["order"] or 0

            percentage = (
                round((count / max_category_order) * 100)
                if max_category_order else 0
            )

            top_categories.append({
                "id": item["pizzas__category_id"],
                "name": item["pizzas__category__name"],
                "orders": count,
                "percentage": percentage
            })

        # 7. Website activity
        website_activity = []

        for order in recent_queryset:

            website_activity.append({
                "id": order.pk,
                "message": f"New order #{order.pk} received",
                "time": timezone.localtime(
                    order.created_at
                ).strftime("%d %b, %I:%M %p")
            })

        # 8. Response
        return Response({
            "total_orders": total_orders,
            "total_revenue": float(total_revenue),
            "total_customer": total_customer,
            "pending_order": pending_order,
            "sale_overview": sale_overview,
            "order_status": order_status,
            "popular_pizzas": popular_pizzas,
            "recent_orders": recent_orders,
            "top_categories": top_categories,
            "website_activity": website_activity

        }, status=status.HTTP_200_OK)



    