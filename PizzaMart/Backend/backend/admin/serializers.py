from rest_framework import serializers
from user .models import Pizzas


class AdminPizzaSerializer(serializers.ModelSerializer):

    class Meta:
        model = Pizzas
        fields = "__all__"