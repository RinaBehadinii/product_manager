from graphene_django.types import DjangoObjectType
from graphene import List, String
from ...models import User


class UserType(DjangoObjectType):
    groups = List(String)

    class Meta:
        model = User
        fields = ("id", "username", "email", "groups")

    def resolve_groups(self, info):
        return [group.name for group in self.groups.all()]
