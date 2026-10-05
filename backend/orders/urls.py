from django.urls import path

from . import views

urlpatterns = [
    path("health/", views.health),
    path("orders/", views.orders_collection),
    path("orders/<int:pk>/", views.order_item),
    path("orders/<int:pk>/photos/", views.order_photos),
    path("checklist/<int:pk>/", views.checklist_item_view),
]
