import graphene
from .types import UserType
from ...models import User


class UserQueries(graphene.ObjectType):
    all_users = graphene.List(UserType)
    user = graphene.Field(UserType, id=graphene.Int(required=True))

    def resolve_all_users(self, info):
        queryset = User.objects.all()
        if not queryset.exists():
            raise Exception("No users found.")
        return queryset

    def resolve_user(self, info, id):
        try:
            return User.objects.get(pk=id)
        except User.DoesNotExist:
            raise Exception(f"User with ID {id} not found.")
