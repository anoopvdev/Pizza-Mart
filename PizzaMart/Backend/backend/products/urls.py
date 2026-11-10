from rest_framework.routers import DefaultRouter

from .views import *

router = DefaultRouter()

router.register(r"products",AdminProductViewSet,basename='admin-products')
router.register(r"orders",AdminOrderViewSet,basename='admin-orders')
router.register(r"coupons",AdminCouponViewSet,basename='admin-coupons')
router.register(r"categories",AdminCategoryViewSet,basename='admin-category')

urlpatterns = router.urls
    

