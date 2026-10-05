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

Просто откройте `index.html` в браузере - никакой сборки или установки не требуется!

```bash
# Откройте в браузере
open index.html

# Или запустите локальный сервер
npx serve .
```

## 📱 Тестирование на мобильном

1. **Chrome DevTools**: Откройте DevTools (F12) → Toggle Device Toolbar (Ctrl+Shift+M)
2. **Реальное устройство**: 
   - Запустите локальный сервер: `npx serve .`
   - Откройте на телефоне: `http://[ваш-IP]:3000`

## 📁 Структура проекта

```
mini-crm/
├── index.html              # Главная страница со списком заказов
├── css/
│   ├── variables.css      # Дизайн-система (цвета, отступы, шрифты)
│   ├── reset.css          # CSS reset для кроссбраузерности
│   └── main.css           # Основные стили компонентов
├── js/
│   ├── data.js            # Слой данных и mock-данные
│   ├── app.js             # Основная логика приложения
│   └── utils.js           # Вспомогательные функции
└── assets/
    └── sample-orders/     # Примеры фотографий заказов
```

## 🎨 Кастомизация

### Изменение цветовой схемы

Отредактируйте `css/variables.css`:

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

В `js/utils.js` добавьте иконку в функцию `getOrderTypeIcon()`:

```javascript
function getOrderTypeIcon(orderType) {
  const icons = {
    'confectionery': `<svg>...</svg>`,
    'auto': `<svg>...</svg>`,
    'your-type': `<svg>...</svg>`,  // Добавьте свой тип
  };
  return icons[orderType] || icons['default'];
}
```

### Добавление пользовательских полей

В `js/data.js` расширьте структуру заказа:

```javascript
{
  id: "ORD-001",
  // ... стандартные поля
  customFields: {
    weight: "5 кг",
    flavor: "Шоколадный",
    // Ваши поля
  }
}
```

## 🔌 Интеграция с API

Замените LocalStorage на реальный API в `js/data.js`:

```javascript
class DataService {
  async getOrders(filters = {}) {
    // Замените это:
    // const orders = JSON.parse(localStorage.getItem(this.STORAGE_KEY));
    
    // На это:
    const response = await fetch('/api/orders', {
      method: 'GET',
      headers: { 'Content-Type': 'application/json' }
    });
    return await response.json();
  }

  async updateOrderStatus(id, newStatus) {
    const response = await fetch(`/api/orders/${id}/status`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ status: newStatus })
    });
    return await response.json();
  }
}
```

### Примеры API endpoints

```
GET    /api/orders              # Получить список заказов
GET    /api/orders/:id          # Получить заказ по ID
PATCH  /api/orders/:id/status   # Обновить статус заказа
POST   /api/orders              # Создать новый заказ
```

## 🌐 WebSocket для real-time обновлений

Добавьте в `js/app.js`:

```javascript
class MiniCRM {
  constructor() {
    this.dataService = new DataService();
    this.setupWebSocket();
  }

  setupWebSocket() {
    const ws = new WebSocket('wss://your-server.com/ws');
    
    ws.onmessage = (event) => {
      const data = JSON.parse(event.data);
      if (data.type === 'order_updated') {
        this.handleOrderUpdate(data.order);
      }
    };
  }

  handleOrderUpdate(order) {
    // Обновить UI
    showToast('Заказ обновлён', 'info');
    this.renderOrderList();
  }
}
```

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
