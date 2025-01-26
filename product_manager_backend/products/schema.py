from decimal import Decimal

import graphene
from graphene_django.types import DjangoObjectType

from .models import Order, Product, User, OrderDetail, Category, Brand, Size, Color, Gender


class UserType(DjangoObjectType):
    class Meta:
        model = User
        fields = ("id", "username", "email", "groups")


class CategoryType(DjangoObjectType):
    class Meta:
        model = Category
        fields = ("id", "name")


class BrandType(DjangoObjectType):
    class Meta:
        model = Brand
        fields = ("id", "name")


class SizeType(DjangoObjectType):
    class Meta:
        model = Size
        fields = ("id", "size")


class ColorType(DjangoObjectType):
    class Meta:
        model = Color
        fields = ("id", "name")


class GenderType(DjangoObjectType):
    class Meta:
        model = Gender
        fields = ("id", "type")


class ProductType(DjangoObjectType):
    class Meta:
        model = Product
        fields = (
            "id",
            "name",
            "description",
            "price",
            "discount",
            "quantity",
            "category",
            "brand",
            "size",
            "color",
            "gender",
        )

    category = graphene.Field(CategoryType)
    brand = graphene.Field(BrandType)
    size = graphene.Field(SizeType)
    color = graphene.Field(ColorType)
    gender = graphene.Field(GenderType)

    def resolve_category(self, info):
        return self.category

    def resolve_brand(self, info):
        return self.brand

    def resolve_size(self, info):
        return self.size

    def resolve_color(self, info):
        return self.color

    def resolve_gender(self, info):
        return self.gender


class OrderType(DjangoObjectType):
    class Meta:
        model = Order
        fields = ("id", "user", "order_date", "status", "order_details")


class OrderDetailType(DjangoObjectType):
    class Meta:
        model = OrderDetail
        fields = ("id", "order", "product", "quantity", "price_at_purchase")


# Define Query
class Query(graphene.ObjectType):
    all_orders = graphene.List(OrderType, status=graphene.String(), user_id=graphene.Int(),
                               start_date=graphene.String(), end_date=graphene.String())
    all_products = graphene.List(ProductType, category=graphene.String(), brand=graphene.String(),
                                 price_min=graphene.Float(), price_max=graphene.Float(),
                                 color=graphene.String(), size=graphene.String(), gender=graphene.String())

    def resolve_all_orders(self, info, status=None, user_id=None, start_date=None, end_date=None):
        queryset = Order.objects.all()
        if status:
            queryset = queryset.filter(status=status)
        if user_id:
            queryset = queryset.filter(user_id=user_id)
        if start_date and end_date:
            queryset = queryset.filter(order_date__date__range=[start_date, end_date])
        return queryset

    def resolve_all_products(self, info, category=None, brand=None, price_min=None, price_max=None, color=None,
                             size=None, gender=None):
        queryset = Product.objects.all()
        if category:
            queryset = queryset.filter(category__name__icontains=category)
        if brand:
            queryset = queryset.filter(brand__name__icontains=brand)
        if price_min is not None:
            queryset = queryset.filter(price__gte=price_min)
        if price_max is not None:
            queryset = queryset.filter(price__lte=price_max)
        if color:
            queryset = queryset.filter(color__name__icontains=color)
        if size:
            queryset = queryset.filter(size__size__icontains=size)
        if gender:
            queryset = queryset.filter(gender__type__icontains=gender)
        return queryset


# Define Mutation
class CreateOrderMutation(graphene.Mutation):
    class Arguments:
        user_id = graphene.Int(required=True)
        status = graphene.String(required=True)

    order = graphene.Field(OrderType)

    def mutate(self, info, user_id, status):
        user = User.objects.get(pk=user_id)
        order = Order.objects.create(user=user, status=status)
        return CreateOrderMutation(order=order)


class UpdateOrderStatusMutation(graphene.Mutation):
    class Arguments:
        order_id = graphene.Int(required=True)
        new_status = graphene.String(required=True)

    order = graphene.Field(OrderType)

    def mutate(self, info, order_id, new_status):
        try:
            order = Order.objects.get(id=order_id)
            if new_status not in dict(Order.STATUS_CHOICES):
                raise Exception("Invalid status value.")
            order.status = new_status
            order.save()
            return UpdateOrderStatusMutation(order=order)
        except Order.DoesNotExist:
            raise Exception("Order not found.")


class CreateProductMutation(graphene.Mutation):
    class Arguments:
        name = graphene.String(required=True)
        description = graphene.String(required=True)
        price = graphene.Decimal(required=True)
        discount = graphene.Decimal(required=False)
        quantity = graphene.Int(required=True)
        category_id = graphene.Int(required=True)
        brand_id = graphene.Int(required=True)
        size_id = graphene.Int(required=True)
        color_id = graphene.Int(required=True)
        gender_id = graphene.Int(required=True)

    product = graphene.Field(ProductType)

    def mutate(self, info, name, description, price, quantity, category_id, brand_id, size_id, color_id, gender_id,
               discount=None):
        category = Category.objects.get(id=category_id)
        brand = Brand.objects.get(id=brand_id)
        size = Size.objects.get(id=size_id)
        color = Color.objects.get(id=color_id)
        gender = Gender.objects.get(id=gender_id)

        product = Product.objects.create(
            name=name,
            description=description,
            price=Decimal(price),
            discount=Decimal(discount) if discount else None,
            quantity=quantity,
            category=category,
            brand=brand,
            size=size,
            color=color,
            gender=gender,
        )
        return CreateProductMutation(product=product)


class UpdateProductMutation(graphene.Mutation):
    class Arguments:
        product_id = graphene.Int(required=True)
        name = graphene.String()
        description = graphene.String()
        price = graphene.Decimal()
        discount = graphene.Decimal()
        quantity = graphene.Int()

    product = graphene.Field(ProductType)

    def mutate(self, info, product_id, **kwargs):
        try:
            product = Product.objects.get(id=product_id)
            for key, value in kwargs.items():
                if value is not None:
                    if key in ["price", "discount"]:
                        value = Decimal(value)
                    setattr(product, key, value)
            product.save()
            return UpdateProductMutation(product=product)
        except Product.DoesNotExist:
            raise Exception("Product not found.")


class Mutation(graphene.ObjectType):
    create_order = CreateOrderMutation.Field()
    update_order_status = UpdateOrderStatusMutation.Field()
    create_product = CreateProductMutation.Field()
    update_product = UpdateProductMutation.Field()


# Schema
schema = graphene.Schema(query=Query, mutation=Mutation)
