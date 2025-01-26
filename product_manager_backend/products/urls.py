from django.urls import path, include
from django.views.decorators.csrf import csrf_exempt
from graphene_django.views import GraphQLView
from rest_framework.routers import DefaultRouter
from rest_framework_simplejwt.views import TokenRefreshView

from products.views import (
    CategoryViewSet, BrandViewSet, SizeViewSet, ColorViewSet, GenderViewSet, ProductViewSet,
    UserViewSet, OrderViewSet, RegisterView, CustomTokenObtainPairView, ReportViewSet
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
    path('api/v1/', include(router_v1.urls)),

    path('api/v1/register/', RegisterView.as_view(), name='register_v1'),
    path('api/v1/token/', CustomTokenObtainPairView.as_view(), name='token_obtain_pair_v1'),
    path('api/v1/token/refresh/', TokenRefreshView.as_view(), name='token_refresh_v1'),

    path("graphql/", csrf_exempt(GraphQLView.as_view(graphiql=True))),
]
