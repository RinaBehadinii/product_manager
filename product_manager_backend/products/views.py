from django.contrib.auth.models import User, Group
from django.db import transaction
from django.db.models import Sum
from django.shortcuts import get_object_or_404
from django.utils import timezone
from rest_framework import status, viewsets
from rest_framework.decorators import action
from rest_framework.exceptions import ValidationError
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from rest_framework.views import APIView
from rest_framework_simplejwt.views import TokenObtainPairView

from products.serializer import (
    CategorySerializer, BrandSerializer, SizeSerializer, ColorSerializer, GenderSerializer,
    ProductSerializer, UserSerializer, OrderSerializer,
    DiscountSerializer, ReportSerializer, CustomTokenObtainPairSerializer
)
from .models import Category, Brand, Size, Color, Gender, Product, Order, OrderDetail, Discount, Report
from .permissions import IsAdmin, IsAdvancedUser


class RegisterView(APIView):
    permission_classes = []

    def post(self, request):
        username = request.data.get('username')
        email = request.data.get('email')
        password = request.data.get('password')

        if User.objects.filter(username=username).exists():
            raise ValidationError({'username': 'Username is already taken.'})
        if User.objects.filter(email=email).exists():
            raise ValidationError({'email': 'Email is already registered.'})

        user = User.objects.create_user(username=username, email=email, password=password)

        try:
            simple_user_group, created = Group.objects.get_or_create(name="Simple User")
            user.groups.add(simple_user_group)
        except Exception as e:
            return Response({'error': f'Could not assign default group: {str(e)}'},
                            status=status.HTTP_500_INTERNAL_SERVER_ERROR)

        return Response({'message': 'User registered successfully!'}, status=status.HTTP_201_CREATED)


class CustomTokenObtainPairView(TokenObtainPairView):
    serializer_class = CustomTokenObtainPairSerializer


class CategoryViewSet(viewsets.ModelViewSet):
    queryset = Category.objects.all()
    serializer_class = CategorySerializer
    permission_classes = [IsAuthenticated]


class BrandViewSet(viewsets.ModelViewSet):
    queryset = Brand.objects.all()
    serializer_class = BrandSerializer
    permission_classes = [IsAuthenticated]


class SizeViewSet(viewsets.ModelViewSet):
    queryset = Size.objects.all()
    serializer_class = SizeSerializer
    permission_classes = [IsAuthenticated]


class ColorViewSet(viewsets.ModelViewSet):
    queryset = Color.objects.all()
    serializer_class = ColorSerializer
    permission_classes = [IsAuthenticated]


class GenderViewSet(viewsets.ModelViewSet):
    queryset = Gender.objects.all()
    serializer_class = GenderSerializer
    permission_classes = [IsAuthenticated]


class ProductViewSet(viewsets.ModelViewSet):
    queryset = Product.objects.all()
    serializer_class = ProductSerializer

    def get_permissions(self):
        if self.action in ['create', 'update', 'destroy']:
            return [IsAdmin(), IsAdvancedUser()]
        return [IsAuthenticated()]

    @action(detail=False, methods=['get'])
    def search(self, request):
        queryset = Product.objects.all()

        filters = {
            'category__name__icontains': request.query_params.get('category'),
            'gender__type__icontains': request.query_params.get('gender'),
            'brand__name__icontains': request.query_params.get('brand'),
            'size__size__icontains': request.query_params.get('size'),
            'color__name__icontains': request.query_params.get('color'),
        }

        for field, value in filters.items():
            if value:
                queryset = queryset.filter(**{field: value})

        try:
            price_min = request.query_params.get('price_min')
            if price_min is not None:
                queryset = queryset.filter(price__gte=float(price_min))

            price_max = request.query_params.get('price_max')
            if price_max is not None:
                queryset = queryset.filter(price__lte=float(price_max))
        except ValueError:
            return Response({"error": "Price filters must be valid numbers."}, status=status.HTTP_400_BAD_REQUEST)

        serializer = self.get_serializer(queryset, many=True)
        return Response(serializer.data)

    @action(detail=True, methods=['get'])
    def quantity(self, request, pk=None):
        product = get_object_or_404(Product, pk=pk)
        sold_quantity = OrderDetail.objects.filter(product=product).aggregate(total_sold=Sum('quantity'))[
                            'total_sold'] or 0
        current_quantity = product.quantity - sold_quantity
        return Response({
            "product_id": product.id,
            "name": product.name,
            "initial_quantity": product.quantity,
            "sold_quantity": sold_quantity,
            "current_quantity": current_quantity
        })


class DiscountViewSet(viewsets.ModelViewSet):
    queryset = Discount.objects.all()
    serializer_class = DiscountSerializer

    def get_permissions(self):
        if self.action in ['create', 'update', 'destroy']:
            return [IsAdmin()]
        return [IsAuthenticated()]


class OrderViewSet(viewsets.ModelViewSet):
    serializer_class = OrderSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        if self.request.user.groups.filter(name__in=["Admin", "Advanced User"]).exists():
            return Order.objects.all()
        return Order.objects.filter(user=self.request.user)

    def perform_create(self, serializer):
        order_details_data = self.request.data.get('order_details', [])
        with transaction.atomic():
            order = serializer.save(user=self.request.user)

            for detail in order_details_data:
                product = get_object_or_404(Product, pk=detail.get('product'))
                quantity = detail.get('quantity')

                if not quantity or not product.update_stock(quantity):
                    raise ValidationError(f"Insufficient stock for product: {product.name}.")

                OrderDetail.objects.create(
                    order=order,
                    product=product,
                    quantity=quantity,
                    price_at_purchase=detail.get('price_at_purchase', product.price)
                )

    @action(detail=True, methods=['patch'])
    def update_status(self, request, pk=None):
        order = get_object_or_404(Order, pk=pk)

        if not self.request.user.groups.filter(name__in=["Admin", "Advanced User"]).exists():
            return Response({"error": "Permission denied."}, status=status.HTTP_403_FORBIDDEN)

        new_status = request.data.get('status')
        if new_status in dict(Order.STATUS_CHOICES).keys():
            order.update_status(new_status)
            return Response({'status': 'Order status updated'})
        return Response({'error': 'Invalid status.'}, status=status.HTTP_400_BAD_REQUEST)

    @action(detail=False, methods=['get'])
    def my_orders(self, request):
        orders = self.get_queryset().filter(user=self.request.user)
        serializer = self.get_serializer(orders, many=True)
        return Response(serializer.data)


class UserViewSet(viewsets.ModelViewSet):
    queryset = User.objects.all()
    serializer_class = UserSerializer

    def get_permissions(self):
        if self.action in ['create', 'destroy', 'update']:
            return [IsAdmin()]
        return [IsAuthenticated()]

    @action(detail=True, methods=['get'])
    def groups(self, request, pk=None):
        user = get_object_or_404(User, pk=pk)
        groups = user.groups.values_list('name', flat=True)
        return Response({'groups': list(groups)})


class ReportViewSet(viewsets.ModelViewSet):
    queryset = Report.objects.all()
    serializer_class = ReportSerializer

    def get_permissions(self):
        if self.action in ['daily_earnings', 'top_selling_products']:
            return [IsAdvancedUser()]
        return [IsAuthenticated()]

    @action(detail=False, methods=['get'])
    def daily_earnings(self, request):
        today = timezone.now().date()
        orders = Order.objects.filter(order_date__date=today)
        total_earnings = sum(
            detail.price_at_purchase * detail.quantity for order in orders for detail in order.order_details.all())
        return Response({"date": today, "total_earnings": total_earnings})

    @action(detail=False, methods=['get'])
    def top_selling_products(self, request):
        top_products = OrderDetail.objects.values('product__name').annotate(total_sold=Sum('quantity')).order_by(
            '-total_sold')[:10]
        return Response(top_products)
