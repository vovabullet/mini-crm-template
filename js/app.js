/**
 * Mini-CRM Application Main Logic
 */

class MiniCRM {
  constructor() {
    this.dataService = new DataService();
    this.currentFilter = this.dataService.getSavedFilter();
    this.currentView = 'list'; // 'list' or 'detail'
    this.currentOrderId = null;
    this.init();
  }

  /**
   * Initialize the application
   */
  async init() {
    this.setupEventListeners();
    this.setupHistoryNavigation();

    const urlParams = new URLSearchParams(window.location.search);
    const orderId = urlParams.get('order');

    if (orderId) {
      await this.showOrderDetail(orderId);
    } else {
      await this.renderOrderList();
    }
  }

  /**
   * Setup event listeners
   */
  setupEventListeners() {
    const filterChips = document.querySelectorAll('.filter-chip');
    filterChips.forEach(chip => {
      chip.addEventListener('click', () => this.handleFilterChange(chip.dataset.filter));
    });

    window.addEventListener('popstate', (event) => {
      if (event.state && event.state.orderId) {
        this.showOrderDetail(event.state.orderId, false);
      } else {
        this.showOrderList(false);
      }
    });
  }

  /**
   * Setup history navigation
   */
  setupHistoryNavigation() {
    document.addEventListener('click', (e) => {
      if (e.target.closest('.back-button')) {
        e.preventDefault();
        window.history.back();
      }
    });
  }

  /**
   * Handle filter change
   */
  async handleFilterChange(filter) {
    this.currentFilter = filter;
    this.dataService.saveFilter(filter);

    document.querySelectorAll('.filter-chip').forEach(chip => {
      chip.classList.toggle('active', chip.dataset.filter === filter);
    });

    await this.renderOrderList();
  }

  /**
   * Render order list
   */
  async renderOrderList() {
    const orders = await this.dataService.getOrders({ status: this.currentFilter });
    const container = document.getElementById('order-list');

    if (!container) return;

    if (orders.length === 0) {
      container.innerHTML = `
        <div class="empty-state">
          <svg width="64" height="64" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <circle cx="12" cy="12" r="10"/>
            <path d="M12 6v6l4 2"/>
          </svg>
          <h3>Заказов не найдено</h3>
          <p>Попробуйте изменить фильтр</p>
        </div>
      `;
      return;
    }

    container.innerHTML = orders.map(order => this.createOrderCard(order)).join('');

    this.setupCardClickHandlers();
    this.setupLazyLoading();
  }

  /**
   * Create order card HTML
   */
  createOrderCard(order) {
    const statusClass = getStatusColor(order.status);
    const priorityClass = getPriorityColor(order.priority);
    const isLate = order.status !== 'completed' && isOverdue(order.dueDate);
    const icon = getOrderTypeIcon(order.orderType);
    const thumbnail = order.photos.length > 0 ? order.photos[0].thumbnail : '';

    return `
      <article class="order-card" data-order-id="${order.id}">
        <div class="order-card-header">
          <div class="order-type-badge">
            ${icon}
            <span>${sanitizeHTML(order.orderTypeLabel)}</span>
          </div>
          <span class="status-badge ${statusClass}">${getStatusLabel(order.status)}</span>
        </div>

        <div class="order-card-body">
          <h3 class="order-number">${sanitizeHTML(order.orderNumber)}</h3>
          <p class="customer-name">${sanitizeHTML(order.customerName)}</p>
          <p class="order-preview">${sanitizeHTML(order.description)}</p>
        </div>

        <div class="order-card-footer">
          <div class="due-date ${isLate ? 'overdue' : ''}">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <circle cx="12" cy="12" r="10"/>
              <path d="M12 6v6l4 2"/>
            </svg>
            <span>${formatRelativeTime(order.dueDate)}</span>
          </div>
          ${order.priority === 'high' ? `<span class="priority-badge ${priorityClass}">Срочно</span>` : ''}
          ${thumbnail ? `<div class="order-thumbnail"><img data-src="${thumbnail}" alt="Order preview" loading="lazy"></div>` : ''}
        </div>
      </article>
    `;
  }

  /**
   * Setup click handlers for order cards
   */
  setupCardClickHandlers() {
    document.querySelectorAll('.order-card').forEach(card => {
      card.addEventListener('click', () => {
        const orderId = card.dataset.orderId;
        this.showOrderDetail(orderId, true);
      });
    });
  }

  /**
   * Setup lazy loading for images
   */
  setupLazyLoading() {
    if ('IntersectionObserver' in window) {
      const imageObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            const img = entry.target;
            img.src = img.dataset.src;
            img.removeAttribute('data-src');
            imageObserver.unobserve(img);
          }
        });
      }, { rootMargin: '50px' });

      document.querySelectorAll('img[data-src]').forEach(img => {
        imageObserver.observe(img);
      });
    } else {
      document.querySelectorAll('img[data-src]').forEach(img => {
        img.src = img.dataset.src;
      });
    }
  }

  /**
   * Show order detail view
   */
  async showOrderDetail(orderId, pushState = true) {
    const order = await this.dataService.getOrderById(orderId);

    if (!order) {
      showToast('Заказ не найден', 'error');
      return;
    }

    if (pushState) {
      window.history.pushState({ orderId }, '', `?order=${orderId}`);
    }

    this.currentOrderId = orderId;
    this.currentView = 'detail';

    document.getElementById('list-view').hidden = true;
    document.getElementById('detail-view').hidden = false;

    this.renderOrderDetail(order);
  }

  /**
   * Show order list view
   */
  async showOrderList(pushState = true) {
    if (pushState) {
      window.history.pushState({}, '', window.location.pathname);
    }

    this.currentView = 'list';
    this.currentOrderId = null;

    document.getElementById('list-view').hidden = false;
    document.getElementById('detail-view').hidden = true;
  }

  /**
   * Render order detail
   */
  renderOrderDetail(order) {
    const container = document.getElementById('detail-content');
    if (!container) return;

    const statusClass = getStatusColor(order.status);
    const icon = getOrderTypeIcon(order.orderType);
    const isLate = order.status !== 'completed' && isOverdue(order.dueDate);

    container.innerHTML = `
      <div class="detail-header">
        <button class="back-button" aria-label="Назад">
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <path d="M19 12H5M12 19l-7-7 7-7"/>
          </svg>
        </button>
        <div class="detail-header-content">
          <h1>${sanitizeHTML(order.orderNumber)}</h1>
          <button class="status-badge ${statusClass} status-button" data-order-id="${order.id}">
            ${getStatusLabel(order.status)}
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <path d="m6 9 6 6 6-6"/>
            </svg>
          </button>
        </div>
      </div>

      <div class="detail-body">
        <section class="card customer-card">
          <div class="card-header">
            <div class="order-type-badge">
              ${icon}
              <span>${sanitizeHTML(order.orderTypeLabel)}</span>
            </div>
          </div>
          <h2>${sanitizeHTML(order.customerName)}</h2>
          <div class="customer-actions">
            <a href="tel:${order.customerPhone}" class="btn btn-secondary">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"/>
              </svg>
              Позвонить
            </a>
          </div>
          ${order.address ? `
            <div class="info-row">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/>
                <circle cx="12" cy="10" r="3"/>
              </svg>
              <span>${sanitizeHTML(order.address)}</span>
            </div>
          ` : ''}
        </section>

        <section class="card order-details-card">
          <h3>Детали заказа</h3>
          <div class="detail-row">
            <span class="label">Описание</span>
            <p>${sanitizeHTML(order.description)}</p>
          </div>
          <div class="detail-row">
            <span class="label">Срок выполнения</span>
            <p class="${isLate ? 'overdue' : ''}">${formatDate(order.dueDate)}</p>
          </div>
          ${order.priority === 'high' ? `
            <div class="detail-row">
              <span class="label">Приоритет</span>
              <span class="priority-badge ${getPriorityColor(order.priority)}">${getPriorityLabel(order.priority)}</span>
            </div>
          ` : ''}
          ${order.startedAt ? `
            <div class="detail-row">
              <span class="label">Начато</span>
              <p>${formatRelativeTime(order.startedAt)}</p>
            </div>
          ` : ''}
          ${order.completedAt ? `
            <div class="detail-row">
              <span class="label">Завершено</span>
              <p>${formatDate(order.completedAt)}</p>
            </div>
          ` : ''}
        </section>

        ${order.specialInstructions ? `
          <section class="card special-instructions">
            <h3>
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <circle cx="12" cy="12" r="10"/>
                <path d="M12 16v-4M12 8h.01"/>
              </svg>
              Особые указания
            </h3>
            <p>${sanitizeHTML(order.specialInstructions)}</p>
          </section>
        ` : ''}

        ${order.photos.length > 0 ? `
          <section class="card photos-card">
            <h3>Фотографии (${order.photos.length})</h3>
            <div class="photo-grid">
              ${order.photos.map((photo, index) => `
                <div class="photo-item" data-photo-index="${index}">
                  <img data-src="${photo.thumbnail}" alt="Order photo ${index + 1}" loading="lazy">
                </div>
              `).join('')}
            </div>
          </section>
        ` : ''}
      </div>

      <div class="detail-footer">
        ${this.getStatusActionButtons(order)}
      </div>
    `;

    this.setupDetailEventHandlers(order);
    this.setupLazyLoading();
  }

  /**
   * Get status action buttons based on current status
   */
  getStatusActionButtons(order) {
    if (order.status === 'new') {
      return `<button class="btn btn-primary btn-block" data-action="start" data-order-id="${order.id}">Начать работу</button>`;
    } else if (order.status === 'in-progress') {
      return `<button class="btn btn-primary btn-block" data-action="complete" data-order-id="${order.id}">Завершить заказ</button>`;
    } else {
      return `<div class="completed-badge">✓ Заказ завершён</div>`;
    }
  }

  /**
   * Setup event handlers for detail view
   */
  setupDetailEventHandlers(order) {
    const statusButton = document.querySelector('.status-button');
    if (statusButton) {
      statusButton.addEventListener('click', () => this.showStatusOptions(order));
    }

    const actionButtons = document.querySelectorAll('[data-action]');
    actionButtons.forEach(button => {
      button.addEventListener('click', () => {
        const action = button.dataset.action;
        const orderId = button.dataset.orderId;
        this.handleStatusAction(action, orderId);
      });
    });

    const photoItems = document.querySelectorAll('.photo-item');
    photoItems.forEach(item => {
      item.addEventListener('click', () => {
        const index = parseInt(item.dataset.photoIndex);
        this.openPhotoViewer(order.photos, index);
      });
    });
  }

  /**
   * Handle status action (start/complete)
   */
  async handleStatusAction(action, orderId) {
    const statusMap = {
      'start': 'in-progress',
      'complete': 'completed'
    };

    const newStatus = statusMap[action];
    if (!newStatus) return;

    const updatedOrder = await this.dataService.updateOrderStatus(orderId, newStatus);

    if (updatedOrder) {
      showToast('Статус обновлён', 'success');
      this.renderOrderDetail(updatedOrder);
    }
  }

  /**
   * Show status options (simplified - just cycle through statuses)
   */
  async showStatusOptions(order) {
    const statuses = ['new', 'in-progress', 'completed'];
    const currentIndex = statuses.indexOf(order.status);
    const nextStatus = statuses[(currentIndex + 1) % statuses.length];

    const updatedOrder = await this.dataService.updateOrderStatus(order.id, nextStatus);

    if (updatedOrder) {
      showToast('Статус обновлён', 'success');
      this.renderOrderDetail(updatedOrder);
    }
  }

  /**
   * Open photo viewer
   */
  openPhotoViewer(photos, startIndex = 0) {
    const viewer = document.createElement('div');
    viewer.className = 'photo-viewer';
    viewer.innerHTML = `
      <div class="photo-viewer-header">
        <span class="photo-counter">${startIndex + 1} / ${photos.length}</span>
        <button class="close-button" aria-label="Закрыть">
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <path d="M18 6 6 18M6 6l12 12"/>
          </svg>
        </button>
      </div>
      <div class="photo-viewer-body">
        <img src="${photos[startIndex].url}" alt="Order photo">
      </div>
      ${photos.length > 1 ? `
        <button class="photo-nav photo-nav-prev" aria-label="Предыдущее фото">
          <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <path d="m15 18-6-6 6-6"/>
          </svg>
        </button>
        <button class="photo-nav photo-nav-next" aria-label="Следующее фото">
          <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <path d="m9 18 6-6-6-6"/>
          </svg>
        </button>
      ` : ''}
    `;

    document.body.appendChild(viewer);
    requestAnimationFrame(() => viewer.classList.add('visible'));

    let currentIndex = startIndex;

    const updatePhoto = (index) => {
      currentIndex = (index + photos.length) % photos.length;
      viewer.querySelector('.photo-viewer-body img').src = photos[currentIndex].url;
      viewer.querySelector('.photo-counter').textContent = `${currentIndex + 1} / ${photos.length}`;
    };

    viewer.querySelector('.close-button').addEventListener('click', () => {
      viewer.classList.remove('visible');
      setTimeout(() => viewer.remove(), 300);
    });

    const prevButton = viewer.querySelector('.photo-nav-prev');
    const nextButton = viewer.querySelector('.photo-nav-next');

    if (prevButton) {
      prevButton.addEventListener('click', () => updatePhoto(currentIndex - 1));
    }
    if (nextButton) {
      nextButton.addEventListener('click', () => updatePhoto(currentIndex + 1));
    }

    viewer.addEventListener('click', (e) => {
      if (e.target === viewer) {
        viewer.classList.remove('visible');
        setTimeout(() => viewer.remove(), 300);
      }
    });
  }
}

document.addEventListener('DOMContentLoaded', () => {
  new MiniCRM();
});
