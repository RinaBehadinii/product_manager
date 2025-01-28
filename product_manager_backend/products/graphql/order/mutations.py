import graphene
from .types import OrderType
from ...models import Order, User


class CreateOrderMutation(graphene.Mutation):
    class Arguments:
        user_id = graphene.Int(required=True)
        status = graphene.String(required=True)

    order = graphene.Field(OrderType)

    def mutate(self, info, user_id, status):
        try:
            user = User.objects.get(pk=user_id)
        except User.DoesNotExist:
            raise Exception(f"User with ID {user_id} not found.")

        if status not in dict(Order.STATUS_CHOICES):
            raise Exception(
                f"Invalid status value: '{status}'. Allowed values are: {', '.join(dict(Order.STATUS_CHOICES).keys())}.")

        order = Order.objects.create(user=user, status=status)
        return CreateOrderMutation(order=order)


class UpdateOrderStatusMutation(graphene.Mutation):
    class Arguments:
        order_id = graphene.Int(required=True)
        new_status = graphene.String(required=True)

    order = graphene.Field(OrderType)

    def mutate(self, info, order_id, new_status):
        try:
            order = Order.objects.get(pk=order_id)
        except Order.DoesNotExist:
            raise Exception(f"Order with ID {order_id} not found.")

        if new_status not in dict(Order.STATUS_CHOICES):
            raise Exception(
                f"Invalid status value: '{new_status}'. Allowed values are: {', '.join(dict(Order.STATUS_CHOICES).keys())}.")

        order.status = new_status
        order.save()
        return UpdateOrderStatusMutation(order=order)
