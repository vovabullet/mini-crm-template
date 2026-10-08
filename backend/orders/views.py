"""JSON API для мини-CRM.

GET    /api/orders/                  список заказов (?status=new,in_progress&q=текст)
POST   /api/orders/                  создать заказ (для внешних источников)
GET    /api/orders/<id>/             детали заказа
PATCH  /api/orders/<id>/             изменить статус, заметку и др. поля
POST   /api/orders/<id>/photos/      загрузить фото (multipart, поле "files")
PATCH  /api/checklist/<id>/          отметить пункт чек-листа {"done": true}
"""
import json
from datetime import date, time

from django.conf import settings
from django.db import transaction
from django.db.models import Q
from django.http import HttpRequest, JsonResponse
from django.shortcuts import get_object_or_404
from django.views.decorators.csrf import csrf_exempt
from django.views.decorators.http import require_GET, require_http_methods, require_POST

from .models import ChecklistItem, Order, OrderPhoto
from .serializers import checklist_item, order_detail, order_summary

STATUS_EVENTS = {
    Order.Status.NEW: "Возвращён в новые",
    Order.Status.IN_PROGRESS: "Принят в работу",
    Order.Status.DONE: "Выполнен",
    Order.Status.CANCELLED: "Отменён",
}

EDITABLE_FIELDS = {
    "title", "description", "category", "client_name", "client_phone",
    "address", "due_date", "due_time", "price", "prepayment", "note",
}


class ApiError(Exception):
    def __init__(self, message: str, status: int = 400):
        super().__init__(message)
        self.status = status


def api_view(func):
    """Единая обработка ошибок + отключение CSRF для JSON API.

    TODO: перед продакшеном добавить аутентификацию исполнителя
    (сессии Django или токены) и вернуть CSRF-проверку.
    """

    def wrapper(request, *args, **kwargs):
        try:
            return func(request, *args, **kwargs)
        except ApiError as exc:
            return JsonResponse({"error": str(exc)}, status=exc.status)
        except (ValueError, TypeError) as exc:
            return JsonResponse({"error": str(exc)}, status=400)

    wrapper.__name__ = func.__name__
    return csrf_exempt(wrapper)


def read_json(request: HttpRequest) -> dict:
    try:
        data = json.loads(request.body or b"{}")
    except json.JSONDecodeError as exc:
        raise ApiError("Некорректный JSON") from exc
    if not isinstance(data, dict):
        raise ApiError("Ожидается JSON-объект")
    return data


def apply_fields(order: Order, data: dict) -> None:
    for field in EDITABLE_FIELDS & data.keys():
        value = data[field]
        if field == "due_date":
            value = date.fromisoformat(value) if value else None
        elif field == "due_time":
            value = time.fromisoformat(value) if value else None
        elif field in {"price", "prepayment"}:
            value = max(int(value or 0), 0)
        elif value is None:
            value = ""
        setattr(order, field, value)


def orders_queryset():
    return Order.objects.prefetch_related("photos", "checklist", "events")


@api_view
@require_http_methods(["GET", "POST"])
def orders_collection(request: HttpRequest):
    if request.method == "POST":
        return create_order(request)

    qs = orders_queryset()
    if statuses := request.GET.get("status"):
        qs = qs.filter(status__in=statuses.split(","))
    if q := request.GET.get("q", "").strip():
        qs = qs.filter(
            Q(title__icontains=q) | Q(client_name__icontains=q)
            | Q(category__icontains=q) | Q(address__icontains=q)
        )
    return JsonResponse([order_summary(o, request) for o in qs], safe=False)


def create_order(request: HttpRequest):
    token = settings.INCOMING_API_TOKEN
    if token and request.headers.get("Authorization") != f"Bearer {token}":
        raise ApiError("Неверный токен", status=401)

    data = read_json(request)
    if not data.get("title") or not data.get("client_name"):
        raise ApiError("Поля title и client_name обязательны")

    with transaction.atomic():
        order = Order(source=data.get("source", ""), external_id=str(data.get("external_id", "")))
        apply_fields(order, data)
        order.save()
        for i, text in enumerate(data.get("checklist", [])):
            order.checklist.create(text=str(text), position=i)
        for i, url in enumerate(data.get("photo_urls", [])):
            order.photos.create(external_url=url, position=i)
        order.log("Заявка получена" + (f" · {order.source}" if order.source else ""))

    return JsonResponse(order_detail(orders_queryset().get(pk=order.pk), request), status=201)


@api_view
@require_http_methods(["GET", "PATCH"])
def order_item(request: HttpRequest, pk: int):
    order = get_object_or_404(orders_queryset(), pk=pk)

    if request.method == "PATCH":
        data = read_json(request)
        with transaction.atomic():
            if "status" in data and data["status"] != order.status:
                if data["status"] not in Order.Status.values:
                    raise ApiError("Неизвестный статус")
                order.status = data["status"]
                order.log(STATUS_EVENTS[order.status])
            apply_fields(order, data)
            order.save()
        order = orders_queryset().get(pk=pk)

    return JsonResponse(order_detail(order, request))


@api_view
@require_POST
def order_photos(request: HttpRequest, pk: int):
    order = get_object_or_404(Order, pk=pk)
    files = request.FILES.getlist("files")
    if not files:
        raise ApiError("Нет файлов в поле files")
    start = order.photos.count()
    for i, f in enumerate(files):
        OrderPhoto.objects.create(order=order, image=f, position=start + i)
    order.log(f"Добавлено фото: {len(files)}")
    return JsonResponse(order_detail(orders_queryset().get(pk=pk), request), status=201)


@api_view
@require_http_methods(["PATCH"])
def checklist_item_view(request: HttpRequest, pk: int):
    item = get_object_or_404(ChecklistItem, pk=pk)
    data = read_json(request)
    if "done" in data:
        item.done = bool(data["done"])
    if data.get("text"):
        item.text = str(data["text"])
    item.save()
    return JsonResponse(checklist_item(item))


@require_GET
def health(request: HttpRequest):
    return JsonResponse({"ok": True})
