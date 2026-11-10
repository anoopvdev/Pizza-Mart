from rest_framework import serializers
from user .models import *
from django.contrib.auth import get_user_model

User = get_user_model()
class AdminPizzaSerializer(serializers.ModelSerializer):

    class Meta:
        model = Pizzas
        fields = "__all__"

class AdminUserSerializers(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = [
            "id",
            "username",
            "first_name",
            "email",
            "phone",
            "is_active",
            "date_joined",
        ]

        read_only_fields = fields

class AdminOrderItemSerializer(serializers.ModelSerializer):
    pizza_name = serializers.CharField(
        source = "pizza.name",
        read_only = True
    )
    class Meta:
        model = OrderItems
        fields = [
            "id",
            "pizzas",
            "pizza_name",
            "quantity",
            "unit_price",
            "subtotal",
        ]
    def get_pizza_image(self,obj):
        if obj.pizzas and obj.pizzas.image:
            request = self.context.get("request")

            image_url = obj.pizzas.image.url

            if request:
                return request.build_absolute_uri(image_url)
            return image_url
        return None

    
class AdminOrderSerializer(serializers.ModelSerializer):
    customer_name = serializers.SerializerMethodField()
    customer_email = serializers.EmailField(source = "user.email",read_only = True)
    items = AdminOrderItemSerializer(many = True,read_only=True)
    class Meta:
        model = Order
        fields = [
            "id",
            "user",
            "customer_name",
            "customer_email",
            "items",
            "total_amount",
            "status",
            "created_at",
            "payment_method",
            "payment_status",

            "delivery_name",
            "delivery_phone",
            "delivery_address",
            "delivery_city",
            "delivery_state",
            "delivery_pincode",


        ]
        read_only = fields
    def get_customer_name(self,obj):
        return (obj.user.get_full_name() or obj.user.username) if obj.user else obj.delivery_name

    def get_customer_email(self, obj):
        return obj.user.email if obj.user else None

class AdminOrderStatusSerailizer(serializers.ModelSerializer):
    class Meta:
        model =Order
        fields = ["status"]


from rest_framework import serializers
from user .models import Coupon


class AdminCouponsSerializer(serializers.ModelSerializer):

    class Meta:
        model = Coupon
        fields = [
            "id",
            "code",
            "discount_type",
            "discount_value",
            "minimum_value",
            "max_discount",
            "start_date",
            "expiry_date",
            "usage_limit",
            "is_active",
        ]
        read_only_fields = ["id"]

    def validate_code(self, value):
        value = value.strip().upper()

        queryset = Coupon.objects.filter(code__iexact=value)

        if self.instance:
            queryset = queryset.exclude(pk=self.instance.pk)

        if queryset.exists():
            raise serializers.ValidationError(
                "This coupon code already exists."
            )

        return value

    def validate_discount_value(self, value):
        if value <= 0:
            raise serializers.ValidationError(
                "Discount value must be greater than zero."
            )

        return value

    def validate(self, attrs):
        instance = self.instance

        discount_type = attrs.get(
            "discount_type",
            getattr(instance, "discount_type", None)
        )

        discount_value = attrs.get(
            "discount_value",
            getattr(instance, "discount_value", None)
        )

        start_date = attrs.get(
            "start_date",
            getattr(instance, "start_date", None)
        )

        expiry_date = attrs.get(
            "expiry_date",
            getattr(instance, "expiry_date", None)
        )

        # Percentage validation
        if discount_type == "percentage" and discount_value is not None:
            if discount_value > 100:
                raise serializers.ValidationError({
                    "discount_value": "Percentage cannot exceed 100."
                })

        # Date validation
        if start_date and expiry_date:
            if expiry_date <= start_date:
                raise serializers.ValidationError({
                    "expiry_date": "Expiry date must be after start date."
                })

        return attrs

        


