from django.contrib.auth.models import Group
from rest_framework import serializers
from rest_framework_simplejwt.serializers import TokenObtainPairSerializer

from .models import Category, Brand, Size, Color, Gender, Product, User, Order, OrderDetail, Discount, Report


class CategorySerializer(serializers.ModelSerializer):
    class Meta:
        model = Category
        fields = ['id', 'name']


class BrandSerializer(serializers.ModelSerializer):
    class Meta:
        model = Brand
        fields = ['id', 'name']


class SizeSerializer(serializers.ModelSerializer):
    class Meta:
        model = Size
        fields = ['id', 'size']


class ColorSerializer(serializers.ModelSerializer):
    class Meta:
        model = Color
        fields = ['id', 'name']


class GenderSerializer(serializers.ModelSerializer):
    class Meta:
        model = Gender
        fields = ['id', 'type']


class ProductSerializer(serializers.ModelSerializer):
    category = serializers.SlugRelatedField(slug_field='name', queryset=Category.objects.all())
    brand = serializers.SlugRelatedField(slug_field='name', queryset=Brand.objects.all())
    color = serializers.SlugRelatedField(slug_field='name', queryset=Color.objects.all())
    size = serializers.SlugRelatedField(slug_field='size', queryset=Size.objects.all())
    gender = serializers.SlugRelatedField(slug_field='type', queryset=Gender.objects.all())

    class Meta:
        model = Product
        fields = [
            'id', 'name', 'description', 'price', 'discount', 'quantity',
            'category', 'brand', 'color', 'size', 'gender'
        ]


class UserSerializer(serializers.ModelSerializer):
    groups = serializers.SlugRelatedField(many=True, slug_field='name', queryset=Group.objects.all())

    class Meta:
        model = User
        fields = ['id', 'username', 'email', 'groups', 'first_name', 'last_name']


class OrderDetailSerializer(serializers.ModelSerializer):
    product = serializers.PrimaryKeyRelatedField(queryset=Product.objects.all())

    class Meta:
        model = OrderDetail
        fields = ['id', 'product', 'quantity', 'price_at_purchase']


class OrderSerializer(serializers.ModelSerializer):
    user = serializers.PrimaryKeyRelatedField(queryset=User.objects.all(), required=False)
    order_details = OrderDetailSerializer(many=True)

    class Meta:
        model = Order
        fields = ['id', 'user', 'order_date', 'status', 'order_details']

    def create(self, validated_data):
        order_details_data = validated_data.pop('order_details', [])
        user = validated_data.pop('user', None) or self.context['request'].user
        order = Order.objects.create(user=user, **validated_data)

        for detail_data in order_details_data:
            OrderDetail.objects.create(order=order, **detail_data)

        return order


class DiscountSerializer(serializers.ModelSerializer):
    product = ProductSerializer()

    class Meta:
        model = Discount
        fields = ['id', 'product', 'discount_percentage', 'start_date', 'end_date']


class ReportSerializer(serializers.ModelSerializer):
    class Meta:
        model = Report
        fields = ['id', 'report_type', 'generated_date']


class CustomTokenObtainPairSerializer(TokenObtainPairSerializer):
    @classmethod
    def get_token(cls, user):
        token = super().get_token(user)
        token['groups'] = list(user.groups.values_list('name', flat=True))
        return token

    def validate(self, attrs):
        data = super().validate(attrs)
        data['user'] = {
            'id': self.user.id,
            'username': self.user.username,
            'email': self.user.email,
            'groups': list(self.user.groups.values_list('name', flat=True))
        }
        return data
