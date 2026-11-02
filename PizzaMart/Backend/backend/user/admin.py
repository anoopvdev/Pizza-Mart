from django.contrib import admin
from django.contrib.auth.admin import UserAdmin
from .models import *
# Register your models here.
admin.site.register(User,UserAdmin)

admin.site.register(Category)
admin.site.register(Pizzas)
admin.site.register(Address)
admin.site.register(Cart)
admin.site.register(CartItems)
admin.site.register(Coupon)
admin.site.register(Order)
admin.site.register(OrderItems)
admin.site.register(Payment)
admin.site.register(ReturnRequest)
admin.site.register(Banner)
admin.site.register(ContactMessage)