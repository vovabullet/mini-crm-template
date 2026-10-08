from django.contrib import admin

from .models import ChecklistItem, Order, OrderEvent, OrderPhoto


class PhotoInline(admin.TabularInline):
    model = OrderPhoto
    extra = 0


class ChecklistInline(admin.TabularInline):
    model = ChecklistItem
    extra = 0


class EventInline(admin.TabularInline):
    model = OrderEvent
    extra = 0
    readonly_fields = ["created_at"]


@admin.register(Order)
class OrderAdmin(admin.ModelAdmin):
    list_display = ["number", "title", "client_name", "category", "status", "due_date", "price"]
    list_filter = ["status", "category", "source"]
    search_fields = ["title", "client_name", "client_phone", "address"]
    readonly_fields = ["number", "created_at", "updated_at"]
    inlines = [PhotoInline, ChecklistInline, EventInline]
