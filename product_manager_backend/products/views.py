from django.contrib.auth.models import User, Group
from django.db import transaction
from django.db.models import Sum
from django.shortcuts import get_object_or_404
from django.utils import timezone
from haystack.query import SearchQuerySet
from rest_framework import status, viewsets
from rest_framework.decorators import action, api_view
from rest_framework.exceptions import ValidationError
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from rest_framework.views import APIView
from rest_framework_simplejwt.views import TokenObtainPairView
from django.core.cache import cache

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

        return Response({'message': 'User registered successfully!', '_links': {'self': request.build_absolute_uri()}},
                        status=status.HTTP_201_CREATED)


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
        cache_key = f"product_search_{request.get_full_path()}"
        cached_data = cache.get(cache_key)

        if cached_data:
            return Response(cached_data)

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

        serializer = self.get_serializer(queryset, many=True, context={'request': request})
        cache.set(cache_key, serializer.data, timeout=300)
        return Response(serializer.data)

    @action(detail=True, methods=['get'])
    def quantity(self, request, pk=None):
        cache_key = f"product_quantity_{pk}"
        cached_data = cache.get(cache_key)
        if cached_data:
            return Response(cached_data)

        product = get_object_or_404(Product, pk=pk)
        sold_quantity = OrderDetail.objects.filter(product=product).aggregate(total_sold=Sum('quantity'))[
                            'total_sold'] or 0
        current_quantity = product.quantity - sold_quantity
        response_data = {
            "product_id": product.id,
            "name": product.name,
            "initial_quantity": product.quantity,
            "sold_quantity": sold_quantity,
            "current_quantity": current_quantity,
            "_links": {
                "self": request.build_absolute_uri(),
                "product_details": request.build_absolute_uri(f"/products/{product.id}/")
            }
        }
        cache.set(cache_key, response_data, timeout=300)
        return Response(response_data)


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
        user = self.request.user

        if user.groups.filter(name__in=["Admin", "Advanced User"]).exists():
            queryset = Order.objects.all()
        else:
            queryset = Order.objects.filter(user=user)

        status_filter = self.request.query_params.get("status")
        if status_filter:
            queryset = queryset.filter(status=status_filter)

        user_filter = self.request.query_params.get("user")
        if user_filter and user.groups.filter(name__in=["Admin", "Advanced User"]).exists():
            queryset = queryset.filter(user_id=user_filter)

        start_date = self.request.query_params.get("start_date")
        end_date = self.request.query_params.get("end_date")

        if start_date and end_date:
            try:
                queryset = queryset.filter(order_date__date__range=[start_date, end_date])
            except ValueError:
                raise ValidationError({"error": "Invalid date format. Use YYYY-MM-DD."})
        elif start_date:
            try:
                queryset = queryset.filter(order_date__date__gte=start_date)
            except ValueError:
                raise ValidationError({"error": "Invalid start_date format. Use YYYY-MM-DD."})
        elif end_date:
            try:
                queryset = queryset.filter(order_date__date__lte=end_date)
            except ValueError:
                raise ValidationError({"error": "Invalid end_date format. Use YYYY-MM-DD."})

        return queryset

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
            return Response({'status': 'Order status updated', '_links': {'self': request.build_absolute_uri()}})
        return Response({'error': 'Invalid status.'}, status=status.HTTP_400_BAD_REQUEST)

    @action(detail=False, methods=['get'])
    def my_orders(self, request):
        cache_key = f"my_orders_{request.user.id}_{request.GET.urlencode()}"  # Unique cache key for filters
        cached_orders = cache.get(cache_key)

        if cached_orders:
            return Response(cached_orders)

        orders = self.get_queryset().filter(user=request.user)
        serializer = self.get_serializer(orders, many=True, context={'request': request})

        cache.set(cache_key, serializer.data, timeout=300)  # Cache serialized data
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
        return Response({'groups': list(groups), '_links': {'self': request.build_absolute_uri()}})


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
        top_products = OrderDetail.objects.values('product__id', 'product__name').annotate(
            total_sold=Sum('quantity')
        ).order_by('-total_sold')[:10]

        response_data = [
            {
                "product_id": product['product__id'],
                "name": product['product__name'],
                "total_sold": product['total_sold'],
                "_links": {
                    "self": request.build_absolute_uri(f"/api/v1/products/{product['product__id']}/"),
                }
            }
            for product in top_products
        ]

        return Response(response_data)


@api_view(['GET'])
def search_products_solr(request):
    query = request.GET.get('q', '')

    if not query:
        return Response(
            {"error": "Query parameter 'q' is required."},
            status=status.HTTP_400_BAD_REQUEST
        )

    search_results = SearchQuerySet().models(Product).filter(content=query)

    product_ids = [result.object.id for result in search_results]

    products = Product.objects.filter(id__in=product_ids)

    serializer = ProductSerializer(products, many=True, context={'request': request})

    return Response(serializer.data, status=status.HTTP_200_OK)


@api_view(['GET'])
def search_orders_solr(request):
    query = request.GET.get('q', '')

    if not query:
        return Response(
            {"error": "Query parameter 'q' is required."},
            status=status.HTTP_400_BAD_REQUEST
        )

    search_results = SearchQuerySet().models(Order).filter(content=query)

    order_ids = [result.object.id for result in search_results]

    orders = Order.objects.filter(id__in=order_ids)

    serializer = OrderSerializer(orders, many=True, context={'request': request})

    return Response(serializer.data, status=status.HTTP_200_OK)
