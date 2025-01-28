import graphene
from .types import ProductType
from ...models import Product


class ProductQueries(graphene.ObjectType):
    all_products = graphene.List(
        ProductType,
        category=graphene.String(),
        brand=graphene.String(),
        price_min=graphene.Float(),
        price_max=graphene.Float(),
        color=graphene.String(),
        size=graphene.String(),
        gender=graphene.String(),
    )
    product = graphene.Field(
        ProductType,
        id=graphene.Int(required=True),
    )

    def resolve_all_products(
        self,
        info,
        category=None,
        brand=None,
        price_min=None,
        price_max=None,
        color=None,
        size=None,
        gender=None,
    ):
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
        if not queryset.exists():
            filters = []
            if category:
                filters.append(f"category='{category}'")
            if brand:
                filters.append(f"brand='{brand}'")
            if price_min is not None:
                filters.append(f"price_min={price_min}")
            if price_max is not None:
                filters.append(f"price_max={price_max}")
            if color:
                filters.append(f"color='{color}'")
            if size:
                filters.append(f"size='{size}'")
            if gender:
                filters.append(f"gender='{gender}'")
            raise Exception(f"No products found with the specified filters: {', '.join(filters)}.")
        return queryset

    def resolve_product(self, info, id):
        try:
            return Product.objects.get(pk=id)
        except Product.DoesNotExist:
            raise Exception(f"Product with ID {id} not found.")
