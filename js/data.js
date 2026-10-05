/**
 * DataService - abstraction layer for data access
 * Currently uses LocalStorage, easily replaceable with API calls
 */

class DataService {
  constructor() {
    this.STORAGE_KEY = 'minicrm_orders';
    this.FILTER_KEY = 'minicrm_filter';
    this.initializeMockData();
  }

  /**
   * Initialize with mock data if storage is empty
   */
  initializeMockData() {
    if (!localStorage.getItem(this.STORAGE_KEY)) {
      localStorage.setItem(this.STORAGE_KEY, JSON.stringify(MOCK_ORDERS));
    }
  }

  /**
   * Get all orders with optional filtering
   * @param {Object} filters - { status: 'new' | 'in-progress' | 'completed' | 'all' }
   * @returns {Promise<Array>}
   */
  async getOrders(filters = {}) {
    return new Promise((resolve) => {
      const orders = JSON.parse(localStorage.getItem(this.STORAGE_KEY) || '[]');

      let filtered = orders;

      if (filters.status && filters.status !== 'all') {
        filtered = orders.filter(order => order.status === filters.status);
      }

      filtered.sort((a, b) => {
        const priorityOrder = { high: 0, medium: 1, low: 2 };
        if (priorityOrder[a.priority] !== priorityOrder[b.priority]) {
          return priorityOrder[a.priority] - priorityOrder[b.priority];
        }
        return new Date(a.dueDate) - new Date(b.dueDate);
      });

      resolve(filtered);
    });
  }

  /**
   * Get a single order by ID
   * @param {string} id
   * @returns {Promise<Object|null>}
   */
  async getOrderById(id) {
    return new Promise((resolve) => {
      const orders = JSON.parse(localStorage.getItem(this.STORAGE_KEY) || '[]');
      const order = orders.find(o => o.id === id);
      resolve(order || null);
    });
  }

  /**
   * Update order status
   * @param {string} id
   * @param {string} newStatus
   * @returns {Promise<Object>}
   */
  async updateOrderStatus(id, newStatus) {
    return new Promise((resolve) => {
      const orders = JSON.parse(localStorage.getItem(this.STORAGE_KEY) || '[]');
      const orderIndex = orders.findIndex(o => o.id === id);

      if (orderIndex !== -1) {
        orders[orderIndex].status = newStatus;

        const now = new Date().toISOString();
        if (newStatus === 'in-progress' && !orders[orderIndex].startedAt) {
          orders[orderIndex].startedAt = now;
        } else if (newStatus === 'completed') {
          orders[orderIndex].completedAt = now;
        }

        localStorage.setItem(this.STORAGE_KEY, JSON.stringify(orders));
        resolve(orders[orderIndex]);
      } else {
        resolve(null);
      }
    });
  }

  /**
   * Save filter preference
   * @param {string} filter
   */
  saveFilter(filter) {
    localStorage.setItem(this.FILTER_KEY, filter);
  }

  /**
   * Get saved filter preference
   * @returns {string}
   */
  getSavedFilter() {
    return localStorage.getItem(this.FILTER_KEY) || 'all';
  }
}

// Mock order data
const MOCK_ORDERS = [
  {
    id: 'ORD-001',
    orderNumber: 'ORD-001',
    customerName: 'Анна Петрова',
    customerPhone: '+7 999 123 4567',
    orderType: 'confectionery',
    orderTypeLabel: 'Кондитерские изделия',
    status: 'new',
    priority: 'high',
    createdAt: '2026-10-03T09:00:00Z',
    dueDate: '2026-10-05T14:00:00Z',
    description: 'Свадебный торт, 3 яруса, белый крем с розами. Вес примерно 5 кг.',
    specialInstructions: 'Без орехов - аллергия у невесты',
    photos: [
      { id: 'p1', url: 'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" width="400" height="400"%3E%3Crect fill="%23f0f0f0" width="400" height="400"/%3E%3Ctext x="50%25" y="50%25" font-size="18" text-anchor="middle" dy=".3em" fill="%23999"%3EФото торта%3C/text%3E%3C/svg%3E', thumbnail: 'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" width="200" height="200"%3E%3Crect fill="%23f0f0f0" width="200" height="200"/%3E%3Ctext x="50%25" y="50%25" font-size="14" text-anchor="middle" dy=".3em" fill="%23999"%3EФото%3C/text%3E%3C/svg%3E' },
      { id: 'p2', url: 'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" width="400" height="400"%3E%3Crect fill="%23f0f0f0" width="400" height="400"/%3E%3Ctext x="50%25" y="50%25" font-size="18" text-anchor="middle" dy=".3em" fill="%23999"%3EРеференс%3C/text%3E%3C/svg%3E', thumbnail: 'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" width="200" height="200"%3E%3Crect fill="%23f0f0f0" width="200" height="200"/%3E%3Ctext x="50%25" y="50%25" font-size="14" text-anchor="middle" dy=".3em" fill="%23999"%3EРеференс%3C/text%3E%3C/svg%3E' }
    ],
    address: 'Москва, ул. Красная площадь, д. 1'
  },
  {
    id: 'ORD-002',
    orderNumber: 'ORD-002',
    customerName: 'Иван Сидоров',
    customerPhone: '+7 999 234 5678',
    orderType: 'auto',
    orderTypeLabel: 'Автомеханика',
    status: 'in-progress',
    priority: 'medium',
    createdAt: '2026-10-02T14:30:00Z',
    startedAt: '2026-10-03T10:00:00Z',
    dueDate: '2026-10-04T18:00:00Z',
    description: 'Замена передних тормозных колодок и дисков на BMW X5',
    specialInstructions: 'Клиент попросил проверить уровень масла',
    photos: [
      { id: 'p3', url: 'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" width="400" height="400"%3E%3Crect fill="%23f0f0f0" width="400" height="400"/%3E%3Ctext x="50%25" y="50%25" font-size="18" text-anchor="middle" dy=".3em" fill="%23999"%3EСтарые колодки%3C/text%3E%3C/svg%3E', thumbnail: 'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" width="200" height="200"%3E%3Crect fill="%23f0f0f0" width="200" height="200"/%3E%3Ctext x="50%25" y="50%25" font-size="12" text-anchor="middle" dy=".3em" fill="%23999"%3EФото%3C/text%3E%3C/svg%3E' }
    ],
    address: 'Москва, Ленинский проспект, 45'
  },
  {
    id: 'ORD-003',
    orderNumber: 'ORD-003',
    customerName: 'Мария Иванова',
    customerPhone: '+7 999 345 6789',
    orderType: 'plumbing',
    orderTypeLabel: 'Сантехника',
    status: 'completed',
    priority: 'high',
    createdAt: '2026-10-01T08:00:00Z',
    startedAt: '2026-10-01T11:00:00Z',
    completedAt: '2026-10-01T15:30:00Z',
    dueDate: '2026-10-01T16:00:00Z',
    description: 'Срочный ремонт протечки в ванной. Замена смесителя.',
    specialInstructions: 'Ключи от квартиры у консьержа',
    photos: [],
    address: 'Москва, Тверская улица, 12, кв. 45'
  },
  {
    id: 'ORD-004',
    orderNumber: 'ORD-004',
    customerName: 'Сергей Волков',
    customerPhone: '+7 999 456 7890',
    orderType: 'confectionery',
    orderTypeLabel: 'Кондитерские изделия',
    status: 'new',
    priority: 'low',
    createdAt: '2026-10-04T07:00:00Z',
    dueDate: '2026-10-10T12:00:00Z',
    description: 'Капкейки на день рождения, 24 штуки. Шоколадные с ванильным кремом.',
    specialInstructions: 'Упаковать в коробку с лентой',
    photos: [
      { id: 'p4', url: 'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" width="400" height="400"%3E%3Crect fill="%23f0f0f0" width="400" height="400"/%3E%3Ctext x="50%25" y="50%25" font-size="18" text-anchor="middle" dy=".3em" fill="%23999"%3EПример капкейков%3C/text%3E%3C/svg%3E', thumbnail: 'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" width="200" height="200"%3E%3Crect fill="%23f0f0f0" width="200" height="200"/%3E%3Ctext x="50%25" y="50%25" font-size="12" text-anchor="middle" dy=".3em" fill="%23999"%3EПример%3C/text%3E%3C/svg%3E' }
    ],
    address: 'Москва, Арбат, 20'
  },
  {
    id: 'ORD-005',
    orderNumber: 'ORD-005',
    customerName: 'Елена Смирнова',
    customerPhone: '+7 999 567 8901',
    orderType: 'auto',
    orderTypeLabel: 'Автомеханика',
    status: 'new',
    priority: 'medium',
    createdAt: '2026-10-04T11:00:00Z',
    dueDate: '2026-10-06T17:00:00Z',
    description: 'Диагностика двигателя Mercedes-Benz C-Class. Горит чек.',
    specialInstructions: 'Машина не заводится, нужен эвакуатор',
    photos: [
      { id: 'p5', url: 'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" width="400" height="400"%3E%3Crect fill="%23f0f0f0" width="400" height="400"/%3E%3Ctext x="50%25" y="50%25" font-size="18" text-anchor="middle" dy=".3em" fill="%23999"%3EЧек энджин%3C/text%3E%3C/svg%3E', thumbnail: 'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" width="200" height="200"%3E%3Crect fill="%23f0f0f0" width="200" height="200"/%3E%3Ctext x="50%25" y="50%25" font-size="12" text-anchor="middle" dy=".3em" fill="%23999"%3EЧек%3C/text%3E%3C/svg%3E' },
      { id: 'p6', url: 'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" width="400" height="400"%3E%3Crect fill="%23f0f0f0" width="400" height="400"/%3E%3Ctext x="50%25" y="50%25" font-size="18" text-anchor="middle" dy=".3em" fill="%23999"%3EКод ошибки%3C/text%3E%3C/svg%3E', thumbnail: 'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" width="200" height="200"%3E%3Crect fill="%23f0f0f0" width="200" height="200"/%3E%3Ctext x="50%25" y="50%25" font-size="12" text-anchor="middle" dy=".3em" fill="%23999"%3EКод%3C/text%3E%3C/svg%3E' }
    ],
    address: 'Москва, Кутузовский проспект, 36'
  }
];

// Export for use in other modules
if (typeof module !== 'undefined' && module.exports) {
  module.exports = { DataService, MOCK_ORDERS };
}
