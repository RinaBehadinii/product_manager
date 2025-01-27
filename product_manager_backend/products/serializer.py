from django.contrib.auth.models import Group
from rest_framework import serializers
from rest_framework.reverse import reverse
from rest_framework_simplejwt.serializers import TokenObtainPairSerializer

from .models import Category, Brand, Size, Color, Gender, Product, User, Order, OrderDetail, Discount, Report


class CategorySerializer(serializers.ModelSerializer):
    _links = serializers.SerializerMethodField()

    class Meta:
        model = Category
        fields = ['id', 'name', '_links']

    def get__links(self, obj):
        return {
            'self': reverse('category-detail', args=[obj.id], request=self.context.get('request')),
            'products': reverse('product-list', request=self.context.get('request')) + f'?category={obj.name}'
        }


class BrandSerializer(serializers.ModelSerializer):
    _links = serializers.SerializerMethodField()

    class Meta:
        model = Brand
        fields = ['id', 'name', '_links']

    def get__links(self, obj):
        return {
            'self': reverse('brand-detail', args=[obj.id], request=self.context.get('request')),
            'products': reverse('product-list', request=self.context.get('request')) + f'?brand={obj.name}'
        }


class SizeSerializer(serializers.ModelSerializer):
    _links = serializers.SerializerMethodField()

    class Meta:
        model = Size
        fields = ['id', 'size', '_links']

    def get__links(self, obj):
        return {
            'self': reverse('size-detail', args=[obj.id], request=self.context.get('request')),
            'products': reverse('product-list', request=self.context.get('request')) + f'?size={obj.size}'
        }


class ColorSerializer(serializers.ModelSerializer):
    _links = serializers.SerializerMethodField()

    class Meta:
        model = Color
        fields = ['id', 'name', '_links']

    def get__links(self, obj):
        return {
            'self': reverse('color-detail', args=[obj.id], request=self.context.get('request')),
            'products': reverse('product-list', request=self.context.get('request')) + f'?color={obj.name}'
        }


class GenderSerializer(serializers.ModelSerializer):
    _links = serializers.SerializerMethodField()

    class Meta:
        model = Gender
        fields = ['id', 'type', '_links']

    def get__links(self, obj):
        return {
            'self': reverse('gender-detail', args=[obj.id], request=self.context.get('request')),
            'products': reverse('product-list', request=self.context.get('request')) + f'?gender={obj.type}'
        }


class ProductSerializer(serializers.ModelSerializer):
    category = serializers.SlugRelatedField(slug_field='name', queryset=Category.objects.all())
    brand = serializers.SlugRelatedField(slug_field='name', queryset=Brand.objects.all())
    color = serializers.SlugRelatedField(slug_field='name', queryset=Color.objects.all())
    size = serializers.SlugRelatedField(slug_field='size', queryset=Size.objects.all())
    gender = serializers.SlugRelatedField(slug_field='type', queryset=Gender.objects.all())
    _links = serializers.SerializerMethodField()

    class Meta:
        model = Product
        fields = [
            'id', 'name', 'description', 'price', 'discount', 'quantity',
            'category', 'brand', 'color', 'size', 'gender', '_links'
        ]

    def get__links(self, obj):
        return {
            'self': reverse('product-detail', args=[obj.id], request=self.context.get('request'))
        }


class UserSerializer(serializers.ModelSerializer):
    groups = serializers.SlugRelatedField(many=True, slug_field='name', queryset=Group.objects.all())
    _links = serializers.SerializerMethodField()

    class Meta:
        model = User
        fields = ['id', 'username', 'email', 'groups', 'first_name', 'last_name', '_links']

    def get__links(self, obj):
        return {
            'self': reverse('user-detail', args=[obj.id], request=self.context.get('request'))
        }


class OrderDetailSerializer(serializers.ModelSerializer):
    product = serializers.PrimaryKeyRelatedField(queryset=Product.objects.all())
    _links = serializers.SerializerMethodField()

    class Meta:
        model = OrderDetail
        fields = ['id', 'product', 'quantity', 'price_at_purchase', '_links']

    def get__links(self, obj):
        return {
            'product': reverse('product-detail', args=[obj.product.id], request=self.context.get('request'))
        }


class OrderSerializer(serializers.ModelSerializer):
    user = serializers.PrimaryKeyRelatedField(queryset=User.objects.all(), required=False)
    order_details = OrderDetailSerializer(many=True)
    _links = serializers.SerializerMethodField()

    class Meta:
        model = Order
        fields = ['id', 'user', 'order_date', 'status', 'order_details', '_links']

    def get__links(self, obj):
        return {
            'self': reverse('order-detail', args=[obj.id], request=self.context.get('request'))
        }

    def create(self, validated_data):
        order_details_data = validated_data.pop('order_details', [])
        user = validated_data.pop('user', None) or self.context['request'].user
        order = Order.objects.create(user=user, **validated_data)

        for detail_data in order_details_data:
            OrderDetail.objects.create(order=order, **detail_data)

        return order


class DiscountSerializer(serializers.ModelSerializer):
    product = ProductSerializer()
    _links = serializers.SerializerMethodField()

    class Meta:
        model = Discount
        fields = ['id', 'product', 'discount_percentage', 'start_date', 'end_date', '_links']

    def get__links(self, obj):
        return {
            'self': reverse('discount-detail', args=[obj.id], request=self.context.get('request'))
        }


class ReportSerializer(serializers.ModelSerializer):
    _links = serializers.SerializerMethodField()

    class Meta:
        model = Report
        fields = ['id', 'report_type', 'generated_date', '_links']

    def get__links(self, obj):
        return {
            'self': reverse('report-detail', args=[obj.id], request=self.context.get('request'))
        }


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
