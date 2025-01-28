from graphene_django.types import DjangoObjectType
from graphene import Decimal
from ...models import Order, OrderDetail


class OrderType(DjangoObjectType):
    class Meta:
        model = Order
        fields = ("id", "user", "order_date", "status", "order_details", "total_price")

    total_price = Decimal()

    def resolve_total_price(self, info):
        # Calculate the total price dynamically
        return sum(
            detail.price_at_purchase * detail.quantity
            for detail in self.order_details.all()
        )


class OrderDetailType(DjangoObjectType):
    class Meta:
        model = OrderDetail
        fields = ("id", "order", "product", "quantity", "price_at_purchase")
