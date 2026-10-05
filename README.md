# Mini CRM

Мобильное приложение-шаблон для управления заказами исполнителей различных услуг (кондитеры, автомеханики, сантехники и др.).

## 🎯 Особенности

- **Мобильный дизайн** - оптимизирован для работы одной рукой на телефоне
- **Быстрый доступ** - мгновенная загрузка, все данные доступны офлайн
- **Современный интерфейс** - закругленные края, плавные анимации, поддержка тёмной темы
- **Фото-галерея** - просмотр фотографий заказа в полноэкранном режиме
- **Управление статусами** - быстрое обновление статуса заказа одним касанием
- **Фильтрация** - удобные фильтры по статусу заказа

## 🚀 Быстрый старт

```bash
# Установите зависимости (один раз)
npm install

# Запустите dev-сервер с горячей перезагрузкой
npm run dev

# Соберите production-версию
npm run build

# Проверьте production-сборку локально
npm run preview
```

## 📱 Тестирование на мобильном

1. **Chrome DevTools**: Откройте DevTools (F12) → Toggle Device Toolbar (Ctrl+Shift+M)
2. **Реальное устройство**: 
   - Запустите dev-сервер: `npm run dev` (он уже слушает все интерфейсы)
   - Откройте на телефоне: `http://[ваш-IP]:3000`

## 🧱 Технологии

- **React 19** — компонентный UI
- **TypeScript** — строгая типизация домена и пропсов
- **Vite** — dev-сервер и сборка
- **LocalStorage** — слой данных для demo-режима (легко меняется на API)

## 📁 Структура проекта

```
mini-crm/
├── index.html                 # Vite-точка входа (root + module script)
├── vite.config.ts             # Конфигурация Vite
├── tsconfig*.json             # Настройки TypeScript
├── assets/
│   └── sample-orders/         # Примеры фотографий заказов
└── src/
    ├── main.tsx               # Точка входа React, подключение стилей
    ├── App.tsx                # Роутинг между списком и деталями, состояние фильтра
    ├── types.ts               # Типы Order, OrderStatus, OrderFilter и др.
    ├── styles/
    │   ├── variables.css      # Дизайн-система (цвета, отступы, шрифты)
    │   ├── reset.css          # CSS reset для кроссбраузерности
    │   └── main.css           # Основные стили компонентов
    ├── data/
    │   ├── dataService.ts     # Слой данных (LocalStorage)
    │   └── mockOrders.ts      # Mock-данные заказов
    ├── hooks/
    │   ├── useRoute.ts        # History-API роутер (?order=...)
    │   └── useOrders.ts       # Загрузка списка и одного заказа
    ├── context/
    │   └── ToastProvider.tsx  # Тосты через React Context
    ├── components/
    │   ├── OrderList.tsx      # Экран списка + фильтры + пустое состояние
    │   ├── OrderCard.tsx      # Карточка заказа
    │   ├── OrderDetail.tsx    # Экран деталей заказа
    │   ├── PhotoViewer.tsx    # Полноэкранный просмотр фото
    │   ├── FilterChips.tsx    # Чипы фильтра по статусу
    │   └── LazyImage.tsx      # Ленивая загрузка изображений
    └── utils/
        ├── format.ts          # Форматирование дат
        ├── labels.ts          # Лейблы/классы статусов и приоритетов
        └── icons.tsx          # SVG-иконки как React-компоненты
```

## 🎨 Кастомизация

### Изменение цветовой схемы

Отредактируйте `src/styles/variables.css`:

```css
:root {
  --color-primary: #2563eb;        /* Основной цвет */
  --color-status-new: #3b82f6;     /* Цвет статуса "Новый" */
  --color-status-in-progress: #f59e0b;  /* "В работе" */
  --color-status-completed: #10b981;    /* "Завершён" */
  /* ... и другие переменные */
}
```

### Добавление типов заказов

В `src/utils/icons.tsx` добавьте иконку в объект `ORDER_TYPE_ICONS`:

```tsx
const ORDER_TYPE_ICONS: Record<string, ReactElement> = {
  confectionery: <svg>...</svg>,
  auto: <svg>...</svg>,
  'your-type': <svg>...</svg>, // Добавьте свой тип
  default: <svg>...</svg>,
};
```

Не забудьте добавить `'your-type'` в union `OrderType` в `src/types.ts` (или оставьте как есть — тип допускает произвольные строки).

### Добавление пользовательских полей

В `src/types.ts` расширьте интерфейс `Order`, а в `src/data/mockOrders.ts` — данные:

```ts
export interface Order {
  id: string;
  // ... стандартные поля
  customFields?: {
    weight: string;
    flavor: string;
    // Ваши поля
  };
}
```

## 🔌 Интеграция с API

Все компоненты обращаются к данным только через `src/data/dataService.ts`, поэтому достаточно заменить реализацию его функций на `fetch`:

```ts
export async function getOrders(filters: OrderFilters = {}): Promise<Order[]> {
  const query = filters.status && filters.status !== 'all' ? `?status=${filters.status}` : '';
  const response = await fetch(`/api/orders${query}`);
  return await response.json();
}

export async function getOrderById(id: string): Promise<Order | null> {
  const response = await fetch(`/api/orders/${id}`);
  return response.ok ? await response.json() : null;
}

export async function updateOrderStatus(
  id: string,
  newStatus: OrderStatus,
): Promise<Order | null> {
  const response = await fetch(`/api/orders/${id}/status`, {
    method: 'PATCH',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ status: newStatus }),
  });
  return response.ok ? await response.json() : null;
}
```

Хуки `useOrders` / `useOrder` уже асинхронные, менять их не нужно.

### Примеры API endpoints

```
GET    /api/orders              # Получить список заказов
GET    /api/orders/:id          # Получить заказ по ID
PATCH  /api/orders/:id/status   # Обновить статус заказа
POST   /api/orders              # Создать новый заказ
```

## 🌐 WebSocket для real-time обновлений

Добавьте хук и подключите его в `src/App.tsx`:

```tsx
function useOrderUpdates(onUpdate: (order: Order) => void) {
  useEffect(() => {
    const ws = new WebSocket('wss://your-server.com/ws');
    ws.onmessage = (event) => {
      const data = JSON.parse(event.data);
      if (data.type === 'order_updated') onUpdate(data.order);
    };
    return () => ws.close();
  }, [onUpdate]);
}
```

Обновлённый заказ кладите в состояние — React сам перерисует список.

## 📊 Метрики производительности

Целевые показатели:
- ⚡ **First Contentful Paint**: < 1s
- 🎨 **Анимации**: 60fps
- 📱 **Размер касаний**: ≥ 44pt
- 💾 **Размер приложения**: < 100KB (без изображений)

Проверка в Chrome DevTools:
1. Lighthouse (Ctrl+Shift+P → "Lighthouse")
2. Performance tab для проверки 60fps
3. Network tab → Throttling для теста на медленной сети

## 🎯 Поддерживаемые браузеры

- ✅ Chrome/Edge 90+
- ✅ Safari 14+
- ✅ Firefox 88+
- ✅ iOS Safari 14+
- ✅ Chrome Android 90+

## 💡 Советы по использованию

### Для кондитеров
- Добавьте фото референсов и готовых работ
- Укажите вес изделий и ингредиенты
- Отмечайте аллергены в особых указаниях

### Для автомехаников
- Прикрепляйте фото повреждений
- Указывайте марку и модель автомобиля
- Отмечайте пробег и номер

### Для сантехников
- Фото проблемы до начала работы
- Адрес и особенности доступа
- Необходимые материалы

## 🔐 Безопасность

- Все данные хранятся локально в браузере
- Нет отправки данных на сервер (в режиме demo)
- При интеграции с API используйте HTTPS
- Добавьте JWT токены для аутентификации

## 📝 Roadmap

- [ ] Push-уведомления о новых заказах
- [ ] Синхронизация между устройствами
- [ ] Экспорт в PDF/Excel
- [ ] Статистика и аналитика
- [ ] Шаблоны заказов
- [ ] Калькулятор стоимости

## 🤝 Contributing

Проект создан как шаблон. Адаптируйте под свои нужды!

## 📄 Лицензия

MIT License - используйте как хотите!

---

**Создано с ❤️ для мастеров своего дела**
