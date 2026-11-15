from django.contrib.auth import get_user_model
from rest_framework import serializers
from user .models import *
from admin .serializers import *
User = get_user_model()

class CategorySerializer(serializers.ModelSerializer):
    class Meta:
        model = Category
        fields = ["id","name"]


class AdminProductSerializer(serializers.ModelSerializer):
    category_name = serializers.CharField(source = "category.name",read_only=True)

    class Meta:
        model = Pizzas
        fields = [
            "id",
            "name",
            "description",
            "price",
            "category",
            "category_name",
            "image",
            "is_available",

        ]
    def valiadte_price(self,value):
        if value <=0:
            raise serializers.ValidationError("Product price must be greater than zero.")
        return value


class AdminOrderStatusSerailizer(serializers.ModelSerializer):
    class Meta:
        model =Order
        fields = ["status"]


class AdminCategorySerialzer(serializers.ModelSerializer):
    class Meta:
        model = Category
        fields = [
            "id",
            "name",
            "description",
            "image",
            "is_active",
        ]
        read_only_field = ["id"]
    def validate_name(self,value):
        value = value.strip()
        queryset = Category.objects.filter(name__iexact=value)
        if self.instance:
            queryset = queryset.exclude(pk=self.instance.pk)
        if not value:
            raise serializers.ValidationError("Category name is required.")
        if queryset.exists():
            raise serializers.ValidationError("This category already exists.")
        return value

class UserProductSerializer(serializers.ModelSerializer):
    class Meta:
        model = Pizzas
        fields = '__all__'



class PizzaSerializer(serializers.ModelSerializer):

    category_name = serializers.CharField(
        source="category.name",
        read_only=True
    )

    class Meta:
        model = Pizzas
        fields = "__all__"
