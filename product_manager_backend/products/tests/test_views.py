from django.contrib.auth.models import User, Group
from rest_framework.test import APITestCase
from rest_framework import status
from products.models import Category, Brand, Size, Color, Gender, Product, Order, OrderDetail, Discount, Report
from rest_framework_simplejwt.tokens import RefreshToken
from time import sleep
from django.core.cache import cache


class APITestCaseBase(APITestCase):
    @classmethod
    def setUpTestData(cls):
        cls.admin_group, _ = Group.objects.get_or_create(name="Admin")
        cls.advanced_user_group, _ = Group.objects.get_or_create(name="Advanced User")
        cls.simple_user_group, _ = Group.objects.get_or_create(name="Simple User")

        cls.admin_user = User.objects.create_user(username="admin", email="admin@example.com", password="password")
        cls.admin_user.groups.add(cls.admin_group)

        cls.simple_user = User.objects.create_user(username="user", email="user@example.com", password="password")
        cls.simple_user.groups.add(cls.simple_user_group)

        cls.admin_token = str(RefreshToken.for_user(cls.admin_user).access_token)

        cls.category = Category.objects.create(name="Shoes")
        cls.brand = Brand.objects.create(name="Nike")
        cls.size = Size.objects.create(size="M")
        cls.color = Color.objects.create(name="Red")
        cls.gender = Gender.objects.create(type="Unisex")
        cls.product = Product.objects.create(
            name="Running Shoes",
            description="Comfortable running shoes",
            price=100,
            discount=10,
            quantity=1000,
            category=cls.category,
            brand=cls.brand,
            size=cls.size,
            color=cls.color,
            gender=cls.gender
        )
        cls.discount = Discount.objects.create(
            product=cls.product,
            discount_percentage=10,
            start_date="2024-01-01",
            end_date="2024-12-31"
        )

    def setUp(self):
        # Apply authentication for each test
        self.client.credentials(HTTP_AUTHORIZATION=f'Bearer {self.admin_token}')

class ProductViewSetTest(APITestCaseBase):
    def test_search_product(self):
        response = self.client.get("/api/v1/products/search/?category=Shoes")
        self.assertEqual(response.status_code, status.HTTP_200_OK)

    def test_get_product_quantity(self):
        response = self.client.get(f"/api/v1/products/{self.product.id}/quantity/")
        self.assertEqual(response.status_code, status.HTTP_200_OK)

class OrderViewSetTest(APITestCaseBase):
    def test_create_order(self):
        order_data = {
            "order_details": [{"product": self.product.id, "quantity": 2, "price_at_purchase": 100}]
        }
        response = self.client.post("/api/v1/orders/", order_data, format="json")
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)

    def test_get_my_orders(self):
        response = self.client.get("/api/v1/orders/my_orders/")
        self.assertEqual(response.status_code, status.HTTP_200_OK)

class OrderThrottlingTest(APITestCaseBase):
    def setUp(self):
        """Clear cache to reset throttling before each test"""
        cache.clear()
        super().setUp()

    def test_order_throttling(self):
        """Ensure that orders are rate-limited properly."""
        order_data = {
            "order_details": [{"product": self.product.id, "quantity": 1, "price_at_purchase": 100}]
        }

        request_count = 0  # Track number of successful requests
        last_status_code = None

        # Keep sending requests until we hit 429
        while True:
            response = self.client.post("/api/v1/orders/", order_data, format="json")
            last_status_code = response.status_code
            request_count += 1
            print(f"Request {request_count}: {last_status_code}")

            # If we hit 429, break the loop
            if last_status_code == status.HTTP_429_TOO_MANY_REQUESTS:
                break

            # Ensure all previous requests were successful
            self.assertIn(last_status_code, [status.HTTP_201_CREATED, status.HTTP_200_OK])

        # Final Assertion: Ensure that the last response was 429
        print(f"Rate Limit Hit at Request {request_count} → Status: {last_status_code}")
        self.assertEqual(last_status_code, status.HTTP_429_TOO_MANY_REQUESTS)

        print("Rate limiting is working correctly!")

class UserViewSetTest(APITestCaseBase):
    def test_get_user_groups(self):
        response = self.client.get(f"/api/v1/users/{self.admin_user.id}/groups/")
        self.assertEqual(response.status_code, status.HTTP_200_OK)

class ReportViewSetTest(APITestCaseBase):
    def test_get_top_selling_products(self):
        response = self.client.get("/api/v1/reports/top_selling_products/")
        self.assertEqual(response.status_code, status.HTTP_200_OK)
