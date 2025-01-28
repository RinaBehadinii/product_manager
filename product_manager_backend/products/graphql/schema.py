import graphene
from .user.queries import UserQueries
from .product.queries import ProductQueries
from .order.queries import OrderQueries
from .product.mutations import CreateProductMutation, UpdateProductMutation
from .order.mutations import CreateOrderMutation, UpdateOrderStatusMutation


class Query(UserQueries, ProductQueries, OrderQueries, graphene.ObjectType):
    pass


class Mutation(graphene.ObjectType):
    create_order = CreateOrderMutation.Field()
    update_order_status = UpdateOrderStatusMutation.Field()
    create_product = CreateProductMutation.Field()
    update_product = UpdateProductMutation.Field()


schema = graphene.Schema(query=Query, mutation=Mutation)
