from haystack import indexes
from .models import Product, Order


class ProductIndex(indexes.SearchIndex, indexes.Indexable):
    text = indexes.CharField(document=True, use_template=True)
    name = indexes.CharField(model_attr='name')
    description = indexes.CharField(model_attr='description')
    price = indexes.DecimalField(model_attr='price')
    discount = indexes.DecimalField(model_attr='discount', null=True)
    quantity = indexes.IntegerField(model_attr='quantity')
    category = indexes.CharField(model_attr='category__name')
    brand = indexes.CharField(model_attr='brand__name')
    color = indexes.CharField(model_attr='color__name')
    size = indexes.CharField(model_attr='size__size')
    gender = indexes.CharField(model_attr='gender__type')

    def get_model(self):
        return Product

    def index_queryset(self, using=None):
        return self.get_model().objects.all()


class OrderIndex(indexes.SearchIndex, indexes.Indexable):
    text = indexes.CharField(document=True, use_template=True)
    status = indexes.CharField(model_attr='status')
    user = indexes.CharField(model_attr='user__username')
    order_date = indexes.DateTimeField(model_attr='order_date')

    def get_model(self):
        return Order

    def index_queryset(self, using=None):
        return self.get_model().objects.all()
