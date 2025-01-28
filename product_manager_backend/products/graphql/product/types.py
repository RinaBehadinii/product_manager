from graphene_django.types import DjangoObjectType
from graphene import Decimal
from ...models import Product, Category, Brand, Size, Color, Gender


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
            "discounted_price",
        )

    discounted_price = Decimal()

    def resolve_discounted_price(self, info):
        # Calculate the discounted price
        if self.discount:
            return self.price - (self.price * self.discount / Decimal(100))
        return self.price


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
