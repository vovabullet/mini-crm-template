from datetime import time, timedelta
from pathlib import Path

from django.core.files import File
from django.core.management.base import BaseCommand
from django.db import transaction
from django.utils import timezone

from orders.models import Order

DEMO_DIR = Path(__file__).resolve().parents[2] / "demo"

# (сдвиг в днях, статус, категория, название, клиент, телефон, адрес, время,
#  цена, предоплата, фото, описание, чек-лист, выполнено, история [(текст, дни назад)])
DEMO = [
    (2, "new", "Кондитер", "Двухъярусный торт с ягодами", "Мария Козлова", "+7 916 555-12-34",
     "Самовывоз", time(12), 6500, 2000, "cake.jpg",
     "День рождения дочки, 8 лет. Крем-чиз, без мастики. Сверху свежие ягоды — клубника, "
     "голубика, малина.\nВес ~2,5 кг. Надпись не нужна.",
     ["Согласовать начинку", "Получить предоплату", "Закупить ягоды", "Собрать и украсить"], [],
     [("Заявка получена", 0)]),
    (0, "in_progress", "Автомеханик", "Замена передних тормозных дисков", "Игорь Савин",
     "+7 903 222-45-10", "Гараж, ул. Заводская 14, бокс 7", time(16, 30), 9800, 0, "brakes.jpg",
     "Kia Rio 2017. Скрип при торможении, бьёт руль. Диски и колодки клиент привезёт сам.",
     ["Снять колёса", "Заменить диски", "Заменить колодки", "Тест-драйв"], [0],
     [("Заявка получена", 2), ("Принят в работу", 1), ("Клиент подтвердил время", 0)]),
    (1, "new", "Сантехник", "Течёт кран под мойкой", "Анна Петрова", "+7 925 777-03-21",
     "ул. Ленина 25, кв. 48, 3 подъезд", time(10), 2500, 0, "faucet.jpg",
     "Подтекает смеситель с выдвижной лейкой, вода собирается на дне шкафа. Нужна диагностика, "
     "возможно замена гибкой подводки.",
     ["Диагностика", "Купить подводку", "Замена"], [], [("Заявка получена", 0)]),
    (3, "in_progress", "Сборка мебели", "Собрать шкаф-купе 2 м", "Дмитрий Орлов",
     "+7 999 101-88-02", "ЖК «Северный», корп. 2, кв. 113", time(9), 7000, 3500, "wardrobe.jpg",
     "7 коробок, всё на месте. Нужно собрать и закрепить к стене. Вынести упаковку.",
     ["Проверить комплектность", "Собрать корпус", "Навесить двери", "Вынести мусор"], [0],
     [("Заявка получена", 3), ("Принят в работу", 3)]),
    (4, "new", "Ремонт техники", "Замена экрана iPhone 13", "Ольга Ким", "+7 915 300-40-50",
     "Выезд или мастерская", None, 11500, 0, None,
     "Разбит дисплей, сенсор работает частично. Клиент пришлёт фото позже.",
     ["Заказать дисплей", "Замена", "Проверка Face ID"], [], [("Заявка получена", 0)]),
    (-1, "done", "Барбер", "Стрижка + борода", "Алексей Н.", "+7 926 444-11-00",
     "Студия, Тверская 8", time(18), 2200, 0, None,
     "Постоянный клиент. Фейд, борода по контуру.", ["Стрижка", "Борода"], [0, 1],
     [("Заявка получена", 4), ("Принят в работу", 4), ("Выполнен", 1)]),
]


class Command(BaseCommand):
    help = "Заполняет базу демонстрационными заказами"

    def add_arguments(self, parser):
        parser.add_argument("--reset", action="store_true", help="Удалить все заказы перед заполнением")

    @transaction.atomic
    def handle(self, *args, reset=False, **options):
        if reset:
            Order.objects.all().delete()
        elif Order.objects.exists():
            self.stdout.write("Заказы уже есть — пропускаю (используйте --reset).")
            return

        today = timezone.localdate()
        now = timezone.now()
        for number, row in enumerate(DEMO, start=1035):
            (shift, status, category, title, client, phone, address, due_time,
             price, prepay, photo, description, checklist, done, events) = row
            order = Order.objects.create(
                number=number, status=status, source="demo", category=category, title=title,
                client_name=client, client_phone=phone, address=address,
                due_date=today + timedelta(days=shift), due_time=due_time,
                price=price, prepayment=prepay, description=description,
            )
            if photo:
                with open(DEMO_DIR / photo, "rb") as fh:
                    order.photos.create().image.save(photo, File(fh), save=True)
            for i, text in enumerate(checklist):
                order.checklist.create(text=text, position=i, done=i in done)
            for i, (text, days_ago) in enumerate(events):
                order.events.create(text=text, created_at=now - timedelta(days=days_ago, minutes=10 - i))

        self.stdout.write(self.style.SUCCESS(f"Создано заказов: {len(DEMO)}"))
