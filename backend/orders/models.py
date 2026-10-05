from django.db import models
from django.utils import timezone


class Order(models.Model):
    class Status(models.TextChoices):
        NEW = "new", "Новый"
        IN_PROGRESS = "in_progress", "В работе"
        DONE = "done", "Готово"
        CANCELLED = "cancelled", "Отменён"

    number = models.PositiveIntegerField("Номер", unique=True, editable=False)
    status = models.CharField("Статус", max_length=20, choices=Status.choices, default=Status.NEW)

    # Откуда пришёл заказ (сайт, Telegram, Avito…) и его id в источнике.
    source = models.CharField("Источник", max_length=50, blank=True)
    external_id = models.CharField("Внешний ID", max_length=100, blank=True)

    category = models.CharField("Категория", max_length=60, blank=True)
    title = models.CharField("Название", max_length=200)
    description = models.TextField("Описание", blank=True)

    client_name = models.CharField("Клиент", max_length=120)
    client_phone = models.CharField("Телефон", max_length=40, blank=True)
    address = models.CharField("Адрес", max_length=255, blank=True)

    due_date = models.DateField("Дата", null=True, blank=True)
    due_time = models.TimeField("Время", null=True, blank=True)

    price = models.PositiveIntegerField("Стоимость, ₽", default=0)
    prepayment = models.PositiveIntegerField("Предоплата, ₽", default=0)

    note = models.TextField("Заметка исполнителя", blank=True)

    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        ordering = ["due_date", "due_time", "-number"]
        verbose_name = "Заказ"
        verbose_name_plural = "Заказы"
        constraints = [
            models.UniqueConstraint(
                fields=["source", "external_id"],
                condition=~models.Q(external_id=""),
                name="unique_external_order",
            )
        ]

    def __str__(self) -> str:
        return f"№{self.number} · {self.title}"

    def save(self, *args, **kwargs):
        if not self.number:
            last = Order.objects.aggregate(models.Max("number"))["number__max"]
            self.number = (last or 1000) + 1
        super().save(*args, **kwargs)

    def log(self, text: str) -> "OrderEvent":
        return self.events.create(text=text)


class OrderPhoto(models.Model):
    order = models.ForeignKey(Order, related_name="photos", on_delete=models.CASCADE)
    image = models.ImageField("Файл", upload_to="orders/%Y/%m/", blank=True)
    external_url = models.URLField("Внешняя ссылка", blank=True)
    position = models.PositiveSmallIntegerField(default=0)
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        ordering = ["position", "id"]
        verbose_name = "Фото"
        verbose_name_plural = "Фото"


class ChecklistItem(models.Model):
    order = models.ForeignKey(Order, related_name="checklist", on_delete=models.CASCADE)
    text = models.CharField("Пункт", max_length=200)
    done = models.BooleanField("Готово", default=False)
    position = models.PositiveSmallIntegerField(default=0)

    class Meta:
        ordering = ["position", "id"]
        verbose_name = "Пункт чек-листа"
        verbose_name_plural = "Чек-лист"


class OrderEvent(models.Model):
    order = models.ForeignKey(Order, related_name="events", on_delete=models.CASCADE)
    text = models.CharField("Событие", max_length=200)
    created_at = models.DateTimeField(default=timezone.now)

    class Meta:
        ordering = ["created_at", "id"]
        verbose_name = "Событие"
        verbose_name_plural = "История"
