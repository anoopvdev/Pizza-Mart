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


class AdminProductViewSet(viewsets.ModelViewSet):
    queryset = Pizzas.objects.select_related("category").all().order_by("-id")
    serializer_class = AdminProductSerializer
    permission_classes = [IsAdminUser,IsAuthenticated]

    parser_classes=[MultiPartParser,FormParser,JSONParser]

class AdminOrderViewSet(viewsets.ReadOnlyModelViewSet):

    queryset = (
        Order.objects
        .select_related("user")
        .prefetch_related("items__pizzas")
        .order_by("-created_at")
    )

    serializer_class = AdminOrderSerializer

    permission_classes = [IsAuthenticated, IsAdminUser]

    def get_queryset(self):

        queryset = super().get_queryset()

        order_status = self.request.query_params.get("status")
        search = self.request.query_params.get("search")

        # Filter by order status
        if order_status and order_status.lower() != "all":
            queryset = queryset.filter(
                status__iexact=order_status
            )

        # Search by order number, customer name, username or email
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

        if not serializer.is_valid(raise_exception=True):
            return Response(
            {"errors": serializer.errors},
            status=status.HTTP_400_BAD_REQUEST
        )
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

    def get(self,request):
        products = Pizzas.objects.filter(is_available=True).order_by("-id")
        serializer = UserProductSerializer(products,many=True,context={"request":request})
        return Response(serializer.data)