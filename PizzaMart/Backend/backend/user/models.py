from django.db import models
from django.contrib.auth.models import AbstractUser
from django.conf import settings
from django.utils import timezone
from django.core.validators import (MinValueValidator,MaxValueValidator)
class User(AbstractUser):
    email=models.EmailField(unique=True)
    phone = models.CharField(max_length=15,unique=True)
    last_name = None

    def __str__(self):
        return self.username

class EmailOTP(models.Model):
    user = models.OneToOneField(settings.AUTH_USER_MODEL,on_delete=models.CASCADE,related_name="email_otp")
    otp_hash = models.CharField(max_length=128)
    expires_at = models.DateTimeField()
    attempts = models.PositiveSmallIntegerField(default=0)
    created_at = models.DateTimeField(auto_now_add=True)
    def __str__(self):
        return f"OTP for user {self.user_id}"
class passwordRestOTP(models.Model):
    user = models.OneToOneField(settings.AUTH_USER_MODEL,on_delete=models.CASCADE,related_name='password_reset_otp')
    otp_hash = models.CharField(max_length=128)
    expires_at = models.DateTimeField()
    attempts = models.PositiveSmallIntegerField(default=0)
    reset_token_hash = models.CharField(max_length=128,blank=True,default="")
    reset_token_expires_at = models.DateTimeField(blank=True,null=True)
    created_at = models.DateTimeField(auto_now_add=True)
    def __str__(self):
        return f"password reset for {self.user.email}"
    # user Profile
def profile_image_path(instance,filename):
    return f"profile_images/user_{instance.user_id}/{filename}"


class UserProfile(models.Model):
    user = models.OneToOneField(settings.AUTH_USER_MODEL,on_delete=models.CASCADE,related_name='profile')
    profile_image= models.ImageField(upload_to="profile_picture/",blank=True,null=True)
    GENDER_CHOICES = [("male", "Male"),("female", "Female"),("other", "Other"),("prefer_not_to_say", "Prefer not to say"),]
    gender = models.CharField(max_length=20,choices=GENDER_CHOICES,blank=True,default="")


    def __str__(self):
        return f"{self.user.username}'s profile"

# Addresss 

class Address(models.Model):
    user = models.ForeignKey(settings.AUTH_USER_MODEL,on_delete=models.CASCADE,related_name='addresses')
    full_name = models.CharField(max_length=150)
    phone = models.CharField(max_length=15)
    address_line = models.TextField()
    city= models.CharField(max_length=100)
    state = models.CharField(max_length=100)
    pincode = models.CharField(max_length=10)
    is_default = models.BooleanField(default=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"{self.full_name} - {self.city}"



# Category Model
class Category(models.Model):
    name = models.CharField(max_length=100, unique=True)
    description = models.TextField(blank=True,null=True)
    image = models.ImageField(upload_to="categories/",blank=True,null=True)
    is_active = models.BooleanField(default=True)
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return self.name
#  Product
class Pizzas(models.Model):
    category = models.ForeignKey(Category,on_delete=models.PROTECT,related_name="products")
    name = models.CharField(max_length=150)
    dsecription = models.TextField()
    image = models.ImageField(upload_to="products/",blank=True,null=True)
    price = models.DecimalField(max_digits=10,decimal_places=2,validators=[MinValueValidator(0)])
    is_avilable = models.BooleanField(default=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return self.name
# CArt 
class Cart(models.Model):
    user = models.OneToOneField(settings.AUTH_USER_MODEL,on_delete=models.CASCADE,related_name='cart')
    coupon = models.ForeignKey("Coupon" ,on_delete=models.SET_NULL,null=True,blank=True, related_name='carts')
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    def __str__(self):
        return f"Cart - {self.user}"

# Cart Items 

class CartItems(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE)
    cart = models.ForeignKey(Cart,on_delete=models.CASCADE,related_name='items')
    pizzas = models.ForeignKey(Pizzas,on_delete=models.CASCADE,related_name='cart_items')
    quantity = models.PositiveIntegerField(default=1,validators=[MinValueValidator(1)])
    added_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        constraints = [models.UniqueConstraint(fields=["cart", "pizzas"],name="unique_product_per_cart")]
    def __str__(self):
        return f"{self.pizzas.name} x {self.quantity}"



class Coupon(models.Model):
    DISCOUT_TYPE = [
        ("percentage","Percentage"),
        ("fixed","Fixed Amount")
    ]
    code = models.CharField(max_length=50,unique=True)
    discount_type = models.CharField(max_length=20,choices=DISCOUT_TYPE)
    discount_value = models.DecimalField(max_digits=10,decimal_places=2,validators=[MinValueValidator(0)])
    minimum_value = models.DecimalField(max_digits=10,decimal_places=2,default=0)
    usage_limit = models.PositiveIntegerField(null=True,blank=True)
    used_count = models.PositiveIntegerField(default=0)
    start_date = models.DateTimeField()
    expiry_date = models.DateTimeField()
    is_active = models.BooleanField(default=True)
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return self.code

class Order(models.Model):
    ORDER_STATUS = [
        ("pending", "Pending"),
        ("confirmed", "Confirmed"),
        ("preparing", "Preparing"),
        ("out_for_delivery", "Out for Delivery"),
        ("delivered", "Delivered"),
        ("cancelled", "Cancelled"),
    ]

    PAYMENT_STATUS = [
        ("pending", "Pending"),
        ("paid", "Paid"),
        ("failed", "Failed"),
        ("refunded", "Refunded"),
    ]

    user = models.ForeignKey(settings.AUTH_USER_MODEL,on_delete=models.PROTECT,related_name='orders')
    address = models.ForeignKey(Address,on_delete=models.SET_NULL,null=True,blank=True,related_name='orders')

     # Preserve delivery information even if address changes.
    # delivery_name = models.CharField(max_length=150)
    # delivery_phone = models.CharField(max_length=15)
    # delivery_address = models.TextField()
    # delivery_city = models.CharField(max_length=100)
    # delivery_state = models.CharField(max_length=100)
    # delivery_pincode = models.CharField(max_length=10)
    coupon = models.ForeignKey(Coupon,on_delete=models.SET_NULL,null=True,blank=True)
    subtotal = models.DecimalField(max_digits=10,decimal_places=2)
    discount = models.DecimalField(max_digits=10,decimal_places=2,default=0)
    delivery_fee = models.DecimalField(max_digits=10,decimal_places=2,default=0)
    total_amount = models.DecimalField(max_digits=10,decimal_places=2)
    status = models.CharField(max_length=40,choices=ORDER_STATUS,default="pending")
    payment_status = models.CharField(max_length=40,choices=PAYMENT_STATUS,default="pending")
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"Order #{self.id} - {self.user}"

# Order items

class OrderItems(models.Model):
    order = models.ForeignKey(Order,on_delete=models.CASCADE,related_name='items')
    pizzas = models.ForeignKey(Pizzas,on_delete=models.PROTECT,related_name='order_items')
    pizza_name = models.CharField(max_length=130)
    unit_price = models.DecimalField(max_digits=10,decimal_places=2)
    quantity = models.PositiveIntegerField(validators=[MinValueValidator(1)])
    subtotal = models.DecimalField(max_digits=10,decimal_places=2)

    def __str__(self):
        return f"{self.pizza_name} x {self.quantity}"
    
# Payment Method
class Payment(models.Model):
    PAYMENT_METHOD = [
        ("cod","Cash on Delivery"),
        ("online","Online Payment")
    ]
    PAYMENT_STATUS = [
        ("pending", "Pending"),
        ("success", "Success"),
        ("failed", "Failed"),
        ("refunded", "Refunded"),
    ]

    order = models.ForeignKey(Order,on_delete=models.PROTECT,related_name='payment')
    payment_method = models.CharField(max_length=40,choices=PAYMENT_METHOD)
    transaction_id = models.CharField(max_length=200,blank=True,null=True)
    amount = models.DecimalField(max_digits=10,decimal_places=2)
    status = models.CharField(max_length=40,choices=PAYMENT_STATUS ,default="pending")
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"Payment - Oreder {self.order_id}"

# Return Models

class ReturnRequest(models.Model):
    RETURN_STATUS = [
        ("pending", "Pending"),
        ("approved", "Approved"),
        ("rejected", "Rejected"),
        ("refunded", "Refunded"),
    ]

    order = models.ForeignKey(Order,on_delete=models.PROTECT,related_name='return_request')
    user = models.ForeignKey(settings.AUTH_USER_MODEL,on_delete=models.PROTECT,related_name='return_request')
    reason = models.TextField()
    status = models.CharField(max_length=30,choices=RETURN_STATUS,default="pending")
    admin_note = models.TextField(blank=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now_add=True)


    def __str__(self):
        return f"Return - Order{self.order_id} "
     
# Banner
class Banner(models.Model):
    title = models.CharField(max_length=150)
    subtitle = models.CharField(max_length=255, blank=True)
    image = models.ImageField(upload_to="banners/")
    link = models.CharField(max_length=255, blank=True)
    is_active = models.BooleanField(default=True)
    start_date = models.DateTimeField(null=True, blank=True)
    end_date = models.DateTimeField(null=True, blank=True)
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return self.title

class ContactMessage(models.Model):
    user = models.ForeignKey(settings.AUTH_USER_MODEL,on_delete=models.SET_NULL,null=True,blank=True,related_name="contact_message")
    name = models.CharField(max_length=160)
    email = models.EmailField()
    phone = models.CharField(max_length=15)
    subject = models.CharField(max_length=200)
    message = models.TextField()
    is_read = models.BooleanField(default=False)
    created_at =models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return self.subject







