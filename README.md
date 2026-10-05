# Mini CRM для исполнителей

Мобильная мини-CRM для исполнителей: кондитеров, автомехаников, сантехников, мастеров и т. д.
Заказы приходят извне через API. Исполнитель видит их списком, открывает карточку с фото,
меняет статус, отмечает чек-лист и пишет заметки.

- **frontend/** — React 19 + Vite + TypeScript + Tailwind v4 + **shadcn/ui** (стиль new-york, zinc)
- **backend/** — Django 5 + SQLite, JSON API, админка
- запуск всего через **npm**

## Быстрый старт

Нужны Node.js 20+ и Python 3.11+.

```bash
npm run setup   # npm-зависимости, Python venv, Django, миграции, демо-заказы
npm run dev     # Django :8000 + Vite :5173 одновременно
```

Откройте http://localhost:5173. С телефона в той же Wi-Fi сети: `http://<IP-компьютера>:5173`.

| Команда | Что делает |
| --- | --- |
| `npm run setup` | Первая установка |
| `npm run setup:api` | Только Python-часть (venv, Django, миграции) |
| `npm run dev` | Фронтенд + бэкенд |
| `npm run dev:web` / `npm run dev:api` | По отдельности |
| `npm run build` | Продакшен-сборка фронтенда в `frontend/dist` |
| `npm run seed` | Пересоздать демо-заказы |
| `npm run manage -- <cmd>` | Любая команда Django, например `npm run manage -- createsuperuser` |

Админка Django: http://localhost:8000/admin (сначала `npm run manage -- createsuperuser`).

## Структура

```
mini-crm/
├── package.json               # npm-скрипты верхнего уровня
├── scripts/backend.mjs        # кроссплатформенный запуск Django (venv, migrate, runserver)
├── backend/
│   ├── config/                # settings, urls
│   └── orders/
│       ├── models.py          # Order, OrderPhoto, ChecklistItem, OrderEvent
│       ├── views.py           # JSON API
│       ├── serializers.py
│       ├── admin.py
│       └── management/commands/seed_demo.py
└── frontend/
    ├── components.json        # конфиг shadcn CLI
    └── src/
        ├── components/
        │   ├── ui/            # компоненты shadcn — как после `npx shadcn add`
        │   │   ├── avatar.tsx  badge.tsx  button.tsx  card.tsx  checkbox.tsx
        │   │   ├── dialog.tsx  input.tsx  separator.tsx  sheet.tsx  skeleton.tsx
        │   │   └── sonner.tsx  tabs.tsx  textarea.tsx
        │   └── orders/        # компоненты приложения на базе ui/
        │       ├── orders-screen.tsx        # экран списка
        │       ├── order-search.tsx  order-filters.tsx  order-list.tsx  order-card.tsx
        │       ├── order-detail-screen.tsx  # экран заказа (выезжает справа)
        │       ├── order-detail.tsx         # содержимое карточки заказа
        │       ├── photo-gallery.tsx        # галерея + просмотр на весь экран + загрузка
        │       ├── order-status-sheet.tsx   # выбор статуса (bottom sheet)
        │       ├── order-facts.tsx  order-client.tsx  order-checklist.tsx
        │       ├── order-note.tsx  order-timeline.tsx  order-actions.tsx
        │       └── order-status-badge.tsx  category-icon.tsx  detail-section.tsx
        ├── hooks/             # use-orders, use-order, use-order-route, use-swipe-back
        ├── lib/               # utils.ts (cn), api.ts, format.ts, order-status.ts
        ├── types/order.ts
        ├── App.tsx  main.tsx  index.css   # index.css — тема shadcn (CSS-переменные)
```

Структура совпадает с проектом после `npx shadcn init`: алиасы `@/components`, `@/components/ui`,
`@/lib/utils`, `@/hooks`. Новые компоненты добавляются обычной командой:

```bash
cd frontend && npx shadcn@latest add dropdown-menu
```

Файлы в `components/ui/` не менялись, кроме `sonner.tsx`: в нём тема берётся из системы, а не из
`next-themes`. Всё, что относится к приложению, лежит в `components/orders/`. Поэтому при
переносе в другой shadcn-проект достаточно скопировать `orders/`, `hooks/`, `lib/` и `types/`.

## API

| Метод | URL | Описание |
| --- | --- | --- |
| GET | `/api/orders/?status=new,in_progress&q=торт` | Список |
| POST | `/api/orders/` | Создать заказ (для внешних источников) |
| GET | `/api/orders/<id>/` | Детали |
| PATCH | `/api/orders/<id>/` | `status`, `note`, `title`, `price`… |
| POST | `/api/orders/<id>/photos/` | Загрузка фото, multipart-поле `files` |
| PATCH | `/api/checklist/<id>/` | `{"done": true}` |

Статусы: `new`, `in_progress`, `done`, `cancelled`. Каждая смена статуса записывается в историю.

### Как внешний источник присылает заказ

```bash
curl -X POST http://localhost:8000/api/orders/ \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer $INCOMING_API_TOKEN" \
  -d '{
    "source": "telegram", "external_id": "msg-123",
    "category": "Кондитер", "title": "Торт на юбилей",
    "client_name": "Мария", "client_phone": "+7 900 000-00-00",
    "address": "Самовывоз", "due_date": "2026-10-10", "due_time": "12:00",
    "price": 6500, "prepayment": 2000,
    "description": "Шоколадный, 2 кг",
    "checklist": ["Согласовать начинку", "Получить предоплату"],
    "photo_urls": ["https://example.com/ref.jpg"]
  }'
```

Пара `source` + `external_id` уникальна, поэтому одна и та же заявка дважды не создастся.
Если переменная `INCOMING_API_TOKEN` не задана, токен не проверяется (это удобно при разработке).
Фронтенд обновляет список каждые 30 секунд и при возвращении во вкладку.

## Перед продакшеном

- Задать `DJANGO_SECRET_KEY`, `DJANGO_DEBUG=0`, `DJANGO_ALLOWED_HOSTS`, `INCOMING_API_TOKEN`.
- Добавить вход исполнителя (сессии Django или токены) и вернуть CSRF-проверку: сейчас API
  открыт, см. `api_view` в `orders/views.py`.
- Перейти с SQLite на Postgres, раздавать `media/` через nginx или S3.
- `frontend/dist` можно раздавать nginx-ом; для API на отдельном домене задать `VITE_API_URL`.

## Windows: если `npm run setup` не создаёт backend/.venv

Обычно `python` в Windows — это заглушка Microsoft Store, а не настоящий Python.
1. Установите Python 3.10+ с python.org и поставьте галочку «Add python.exe to PATH».
2. Параметры → Приложения → Дополнительные параметры → Псевдонимы выполнения приложений → выключите `python.exe` и `python3.exe`.
3. Перезапустите терминал, проверьте `py -3 --version`, затем выполните `npm run setup:api`.

Путь к Python можно указать явно: `$env:PYTHON="C:\Python313\python.exe"; npm run setup:api`.
