from django.urls import path, include
from django.views.decorators.csrf import csrf_exempt
from graphene_django.views import GraphQLView
from rest_framework.routers import DefaultRouter
from rest_framework_simplejwt.views import TokenRefreshView
from rest_framework import permissions
from drf_yasg.views import get_schema_view
from drf_yasg import openapi

from products.views import (
    CategoryViewSet, BrandViewSet, SizeViewSet, ColorViewSet, GenderViewSet, ProductViewSet,
    UserViewSet, OrderViewSet, RegisterView, CustomTokenObtainPairView, ReportViewSet
)

# Swagger/OpenAPI schema view
schema_view = get_schema_view(
    openapi.Info(
        title="API Documentation",
        default_version='v1',
        description="Comprehensive API documentation for the application",
        terms_of_service="https://www.example.com/terms/",
        contact=openapi.Contact(email="support@example.com"),
        license=openapi.License(name="BSD License"),
    ),
    public=True,
    permission_classes=[permissions.AllowAny],
)

router_v1 = DefaultRouter()

# Version 1 API endpoints
router_v1.register(r'categories', CategoryViewSet)
router_v1.register(r'brands', BrandViewSet)
router_v1.register(r'sizes', SizeViewSet)
router_v1.register(r'colors', ColorViewSet)
router_v1.register(r'genders', GenderViewSet)
router_v1.register(r'products', ProductViewSet)
router_v1.register(r'users', UserViewSet)
router_v1.register(r'reports', ReportViewSet)
router_v1.register(r'orders', OrderViewSet, basename='order')

urlpatterns = [
    path('api/v1/docs/', schema_view.with_ui('swagger', cache_timeout=0), name='swagger-docs'),
    path('api/v1/redoc/', schema_view.with_ui('redoc', cache_timeout=0), name='redoc-docs'),

    path('api/v1/', include(router_v1.urls)),

    path('api/v1/register/', RegisterView.as_view(), name='register_v1'),
    path('api/v1/token/', CustomTokenObtainPairView.as_view(), name='token_obtain_pair_v1'),
    path('api/v1/token/refresh/', TokenRefreshView.as_view(), name='token_refresh_v1'),

    path("graphql/execute/", csrf_exempt(GraphQLView.as_view())),
]
