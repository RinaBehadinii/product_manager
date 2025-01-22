from django.contrib import admin

from .models import Category, Brand, Size, Color, Gender, Product, Order, OrderDetail, Discount, Report

admin.site.register(Category)
admin.site.register(Brand)
admin.site.register(Size)
admin.site.register(Color)
admin.site.register(Gender)
admin.site.register(Product)
admin.site.register(Order)
admin.site.register(OrderDetail)
admin.site.register(Discount)
admin.site.register(Report)
