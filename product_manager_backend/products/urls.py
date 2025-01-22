from django.urls import path, include
from rest_framework.routers import DefaultRouter
from rest_framework_simplejwt.views import TokenRefreshView

from products.views import (
    CategoryViewSet, BrandViewSet, SizeViewSet, ColorViewSet, GenderViewSet, ProductViewSet,
    UserViewSet, OrderViewSet, RegisterView, CustomTokenObtainPairView, ReportViewSet
)

router = DefaultRouter()

router.register(r'categories', CategoryViewSet)
router.register(r'brands', BrandViewSet)
router.register(r'sizes', SizeViewSet)
router.register(r'colors', ColorViewSet)
router.register(r'genders', GenderViewSet)
router.register(r'products', ProductViewSet)
router.register(r'users', UserViewSet)
router.register(r'reports', ReportViewSet)
router.register(r'orders', OrderViewSet, basename='order')

urlpatterns = [
    path('', include(router.urls)),
    path('register/', RegisterView.as_view(), name='register'),
    path('api/token/', CustomTokenObtainPairView.as_view(), name='token_obtain_pair'),
    path('api/token/refresh/', TokenRefreshView.as_view(), name='token_refresh'),
]
