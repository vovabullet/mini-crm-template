"""Преобразование моделей в JSON без внешних зависимостей."""
from .models import ChecklistItem, Order, OrderEvent, OrderPhoto


def photo_url(photo: OrderPhoto, request) -> str:
    if photo.image:
        return request.build_absolute_uri(photo.image.url)
    return photo.external_url


def order_summary(order: Order, request) -> dict:
    photos = list(order.photos.all())
    checklist = list(order.checklist.all())
    return {
        "id": order.id,
        "number": order.number,
        "status": order.status,
        "source": order.source,
        "category": order.category,
        "title": order.title,
        "client_name": order.client_name,
        "address": order.address,
        "due_date": order.due_date.isoformat() if order.due_date else None,
        "due_time": order.due_time.strftime("%H:%M") if order.due_time else None,
        "price": order.price,
        "prepayment": order.prepayment,
        "thumbnail": photo_url(photos[0], request) if photos else None,
        "photo_count": len(photos),
        "checklist_total": len(checklist),
        "checklist_done": sum(1 for item in checklist if item.done),
    }


def checklist_item(item: ChecklistItem) -> dict:
    return {"id": item.id, "text": item.text, "done": item.done}


def order_event(event: OrderEvent) -> dict:
    return {"id": event.id, "text": event.text, "created_at": event.created_at.isoformat()}


def order_detail(order: Order, request) -> dict:
    return {
        **order_summary(order, request),
        "description": order.description,
        "client_phone": order.client_phone,
        "note": order.note,
        "photos": [{"id": p.id, "url": photo_url(p, request)} for p in order.photos.all()],
        "checklist": [checklist_item(i) for i in order.checklist.all()],
        "events": [order_event(e) for e in order.events.all()],
        "created_at": order.created_at.isoformat(),
    }
