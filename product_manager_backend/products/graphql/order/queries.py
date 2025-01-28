import graphene
from .types import OrderType
from ...models import Order


class OrderQueries(graphene.ObjectType):
    all_orders = graphene.List(
        OrderType,
        status=graphene.String(),
        user_id=graphene.Int(),
        start_date=graphene.String(),
        end_date=graphene.String(),
    )

    def resolve_all_orders(self, info, status=None, user_id=None, start_date=None, end_date=None):
        queryset = Order.objects.all()
        if status:
            queryset = queryset.filter(status=status)
        if user_id:
            queryset = queryset.filter(user_id=user_id)
        if start_date and end_date:
            queryset = queryset.filter(order_date__date__range=[start_date, end_date])
        if not queryset.exists():
            filters = []
            if status:
                filters.append(f"status='{status}'")
            if user_id:
                filters.append(f"user_id={user_id}")
            if start_date and end_date:
                filters.append(f"date_range=({start_date} to {end_date})")
            raise Exception(f"No orders found with the specified filters: {', '.join(filters)}.")
        return queryset
