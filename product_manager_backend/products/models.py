from django.contrib.auth.models import User, Group, Permission
from django.db import models


class Category(models.Model):
    name = models.CharField(max_length=100)

    def __str__(self):
        return self.name


class Brand(models.Model):
    name = models.CharField(max_length=100)

    def __str__(self):
        return self.name


class Size(models.Model):
    size = models.CharField(max_length=10)

    def __str__(self):
        return self.size


class Color(models.Model):
    name = models.CharField(max_length=50)

    def __str__(self):
        return self.name


class Gender(models.Model):
    type = models.CharField(max_length=50)

    def __str__(self):
        return self.type


class Product(models.Model):
    name = models.CharField(max_length=200)
    description = models.TextField()
    price = models.DecimalField(max_digits=10, decimal_places=2)
    discount = models.DecimalField(max_digits=4, decimal_places=2, null=True, blank=True)
    quantity = models.IntegerField()
    category = models.ForeignKey(Category, on_delete=models.CASCADE)
    brand = models.ForeignKey(Brand, on_delete=models.CASCADE)
    color = models.ForeignKey(Color, on_delete=models.CASCADE)
    size = models.ForeignKey(Size, on_delete=models.CASCADE)
    gender = models.ForeignKey(Gender, on_delete=models.CASCADE)

    def __str__(self):
        return self.name

    def update_stock(self, quantity_sold):
        if self.quantity >= quantity_sold:
            self.quantity -= quantity_sold
            self.save()
            return True
        return False


class Role(models.Model):
    name = models.CharField(max_length=50, unique=True)

    def __str__(self):
        return self.name


class Order(models.Model):
    STATUS_CHOICES = [
        ('Pending', 'Pending'),
        ('Confirmed', 'Confirmed'),
        ('Shipped', 'Shipped'),
        ('Delivered', 'Delivered'),
    ]

    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name='orders')
    order_date = models.DateTimeField(auto_now_add=True)
    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default='Pending')

    def __str__(self):
        return f"Order {self.id} - {self.user.username}"

    def update_status(self, new_status):
        if new_status in dict(self.STATUS_CHOICES).keys():
            self.status = new_status
            self.save()


class OrderDetail(models.Model):
    order = models.ForeignKey(Order, on_delete=models.CASCADE, related_name='order_details')
    product = models.ForeignKey(Product, on_delete=models.CASCADE)
    quantity = models.PositiveIntegerField()
    price_at_purchase = models.DecimalField(max_digits=10, decimal_places=2)

    def __str__(self):
        return f"{self.quantity} of {self.product.name} for {self.order}"


class Discount(models.Model):
    product = models.ForeignKey(Product, on_delete=models.CASCADE, related_name='discounts')
    discount_percentage = models.DecimalField(max_digits=5, decimal_places=2)
    start_date = models.DateField()
    end_date = models.DateField()

    def __str__(self):
        return f"{self.discount_percentage}% off on {self.product.name}"


class Report(models.Model):
    REPORT_TYPE_CHOICES = [
        ('Earnings', 'Earnings'),
        ('Product Performance', 'Product Performance'),
    ]

    report_type = models.CharField(max_length=50, choices=REPORT_TYPE_CHOICES)
    generated_date = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"{self.report_type} report on {self.generated_date}"
