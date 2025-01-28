import graphene
from graphene import Decimal
from .types import ProductType
from ...models import Product, Category, Brand, Size, Color, Gender


class CreateProductMutation(graphene.Mutation):
    class Arguments:
        name = graphene.String(required=True)
        description = graphene.String(required=True)
        price = Decimal(required=True)
        discount = Decimal(required=False)
        quantity = graphene.Int(required=True)
        category_id = graphene.Int(required=True)
        brand_id = graphene.Int(required=True)
        size_id = graphene.Int(required=True)
        color_id = graphene.Int(required=True)
        gender_id = graphene.Int(required=True)

    product = graphene.Field(ProductType)

    def mutate(self, info, name, description, price, quantity, category_id, brand_id, size_id, color_id, gender_id, discount=None):
        try:
            category = Category.objects.get(id=category_id)
        except Category.DoesNotExist:
            raise Exception(f"Category with ID {category_id} not found.")

        try:
            brand = Brand.objects.get(id=brand_id)
        except Brand.DoesNotExist:
            raise Exception(f"Brand with ID {brand_id} not found.")

        try:
            size = Size.objects.get(id=size_id)
        except Size.DoesNotExist:
            raise Exception(f"Size with ID {size_id} not found.")

        try:
            color = Color.objects.get(id=color_id)
        except Color.DoesNotExist:
            raise Exception(f"Color with ID {color_id} not found.")

        try:
            gender = Gender.objects.get(id=gender_id)
        except Gender.DoesNotExist:
            raise Exception(f"Gender with ID {gender_id} not found.")

        product = Product.objects.create(
            name=name,
            description=description,
            price=price,
            discount=discount if discount else None,
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
        price = Decimal()
        discount = Decimal()
        quantity = graphene.Int()

    product = graphene.Field(ProductType)

    def mutate(self, info, product_id, **kwargs):
        try:
            product = Product.objects.get(id=product_id)
        except Product.DoesNotExist:
            raise Exception(f"Product with ID {product_id} not found.")

        for key, value in kwargs.items():
            if value is not None:
                setattr(product, key, value)

        product.save()
        return UpdateProductMutation(product=product)
