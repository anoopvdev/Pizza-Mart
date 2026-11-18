from django.shortcuts import render
from rest_framework.permissions import IsAdminUser,IsAuthenticated
from .serializers import *
from django.db.models import Q
from rest_framework.decorators import action
from rest_framework import viewsets
from rest_framework.parsers import MultiPartParser,FormParser,JSONParser
from rest_framework.response import Response
from rest_framework import status
from rest_framework.views import APIView
from rest_framework.permissions import AllowAny
from user .pagination import PizzaPagination


class AdminProductViewSet(viewsets.ModelViewSet):
    queryset = (
        Pizzas.objects
        .select_related("category")
        .all()
        .order_by("-id")
    )

    serializer_class = AdminProductSerializer
    permission_classes = [IsAdminUser, IsAuthenticated]
    parser_classes = [MultiPartParser, FormParser, JSONParser]

    # Automatically make newly added pizzas active
    def perform_create(self, serializer):
        serializer.save(is_available=True)

    # Handle product deletion safely
    def perform_destroy(self, instance):
        if OrderItems.objects.filter(pizzas=instance).exists():
            instance.is_available = False
            instance.save(update_fields=["is_available"])
        else:
            instance.delete()



class AdminOrderViewSet(viewsets.ReadOnlyModelViewSet):

    serializer_class = AdminOrderSerializer

    permission_classes = [IsAuthenticated, IsAdminUser]



    queryset = (
        Order.objects
        .select_related("user")
        .prefetch_related("items__pizzas")
        .order_by("-created_at")
    )

    def get_queryset(self):

        queryset = super().get_queryset()

        order_status = self.request.query_params.get("status")
        search = self.request.query_params.get("search")

        # Filter by order status
        if order_status and order_status.lower() != "all":
            queryset = queryset.filter(
                status__iexact=order_status
            )


        if search:
            queryset = queryset.filter(
                Q(order_number__icontains=search) |
                Q(user__username__icontains=search) |
                Q(user__email__icontains=search) |
                Q(delivery_name__icontains=search)
            )

        return queryset

    @action(
        detail=True,
        methods=["patch"],
        url_path="status"
    )
    def update_status(self, request, pk=None):

        order = self.get_object()

        serializer = AdminOrderStatusSerailizer(
            order,
            data=request.data,
            partial=True
        )

        serializer.is_valid(raise_exception=True)
        serializer.save()

        return Response({
            "message": "Order status updated successfully.",
            "order": AdminOrderSerializer(
                order,
                context={"request": request}
            ).data
        }, status=status.HTTP_200_OK)






class AdminCouponViewSet(viewsets.ModelViewSet):
    queryset = Coupon.objects.all().order_by("-id")
    serializer_class = AdminCouponsSerializer
    permission_classes = [IsAuthenticated,IsAdminUser]

    def create(self,request, *args, **kwargs):
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        serializer.save()
        return Response({
            "message":"Coupon created successfully.",
            "coupon":serializer.data
        },status=status.HTTP_201_CREATED)
    def update(self, request, *args, **kwargs):
        partial = kwargs.pop("partial",False)
        instance = self.get_object()
        serializer = self.get_serializer(instance,data=request.data,partial=partial)
        serializer.is_valid(raise_exception=True)
        serializer.save()
        return Response({
            "message":"Coupon update successfully.",
            "coupon":serializer.data
        },status=status.HTTP_200_OK)

    def destroy(self, request, *args, **kwargs):
        instance = self.get_object()
        instance = delete()
        return Response({
            "Message":"Coupon deleted successfully."
        },status=status.HTTP_200_OK)

class AdminCategoryViewSet(viewsets.ModelViewSet):
    queryset = Category.objects.all().order_by("-id")
    serializer_class = AdminCategorySerialzer

    permission_classes = [IsAuthenticated,IsAdminUser]

    parser_classes = [
        MultiPartParser,
        FormParser,
        JSONParser
    ]




class UserProductListView(APIView):
    permission_classes = [AllowAny]
    authentication_classes = []

    def perform_create(self, serializer):
        serializer.save(is_available=True)

    def get(self, request):
        pizzas = (
            Pizzas.objects
            .filter(is_available=True)
            .select_related("category")
            .order_by("-created_at")
        )

        paginator = PizzaPagination()
        paginated_pizzas = paginator.paginate_queryset(
            pizzas, request, view=self
        )

        serializer = PizzaSerializer(
            paginated_pizzas,
            many=True,
            context={"request": request}
        )

        return paginator.get_paginated_response(serializer.data)