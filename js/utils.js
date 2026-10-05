/**
 * Utility functions for Mini-CRM
 */

/**
 * Format date to relative time (e.g., "2 hours ago", "Tomorrow at 14:00")
 * @param {string} dateString - ISO date string
 * @returns {string}
 */
function formatRelativeTime(dateString) {
  const date = new Date(dateString);
  const now = new Date();
  const diffMs = date - now;
  const diffSeconds = Math.floor(diffMs / 1000);
  const diffMinutes = Math.floor(diffSeconds / 60);
  const diffHours = Math.floor(diffMinutes / 60);
  const diffDays = Math.floor(diffHours / 24);

  if (diffSeconds < -60) {
    const absMinutes = Math.abs(diffMinutes);
    const absHours = Math.abs(diffHours);
    const absDays = Math.abs(diffDays);

    if (absMinutes < 60) {
      return `${absMinutes} мин назад`;
    } else if (absHours < 24) {
      return `${absHours} ч назад`;
    } else if (absDays === 1) {
      return 'Вчера';
    } else if (absDays < 7) {
      return `${absDays} дн назад`;
    } else {
      return date.toLocaleDateString('ru-RU', { day: 'numeric', month: 'short' });
    }
  } else if (diffSeconds < 60) {
    return 'Только что';
  } else if (diffMinutes < 60) {
    return `Через ${diffMinutes} мин`;
  } else if (diffHours < 24) {
    return `Через ${diffHours} ч`;
  } else if (diffDays === 1) {
    return `Завтра в ${date.toLocaleTimeString('ru-RU', { hour: '2-digit', minute: '2-digit' })}`;
  } else if (diffDays < 7) {
    return `Через ${diffDays} дн`;
  } else {
    return date.toLocaleDateString('ru-RU', { day: 'numeric', month: 'short', hour: '2-digit', minute: '2-digit' });
  }
}

/**
 * Format date to readable string
 * @param {string} dateString - ISO date string
 * @returns {string}
 */
function formatDate(dateString) {
  const date = new Date(dateString);
  return date.toLocaleDateString('ru-RU', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  });
}

/**
 * Get status color class
 * @param {string} status
 * @returns {string}
 */
function getStatusColor(status) {
  const colors = {
    'new': 'status-new',
    'in-progress': 'status-in-progress',
    'completed': 'status-completed'
  };
  return colors[status] || 'status-new';
}

/**
 * Get status label in Russian
 * @param {string} status
 * @returns {string}
 */
function getStatusLabel(status) {
  const labels = {
    'new': 'Новый',
    'in-progress': 'В работе',
    'completed': 'Завершён'
  };
  return labels[status] || status;
}

/**
 * Get priority color class
 * @param {string} priority
 * @returns {string}
 */
function getPriorityColor(priority) {
  const colors = {
    'high': 'priority-high',
    'medium': 'priority-medium',
    'low': 'priority-low'
  };
  return colors[priority] || 'priority-medium';
}

/**
 * Get priority label
 * @param {string} priority
 * @returns {string}
 */
function getPriorityLabel(priority) {
  const labels = {
    'high': 'Высокий',
    'medium': 'Средний',
    'low': 'Низкий'
  };
  return labels[priority] || priority;
}

/**
 * Get order type icon (SVG)
 * @param {string} orderType
 * @returns {string}
 */
function getOrderTypeIcon(orderType) {
  const icons = {
    'confectionery': `<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M20 21v-8a2 2 0 0 0-2-2H6a2 2 0 0 0-2 2v8"/><path d="M4 16s.5-1 2-1 2.5 2 4 2 2.5-2 4-2 2.5 2 4 2 2-1 2-1"/><path d="M2 21h20"/><path d="M7 8v3"/><path d="M12 8v3"/><path d="M17 8v3"/><path d="M7 4h10v4H7z"/></svg>`,
    'auto': `<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M19 17h2c.6 0 1-.4 1-1v-3c0-.9-.7-1.7-1.5-1.9C18.7 10.6 16 10 16 10s-1.3-1.4-2.2-2.3c-.5-.4-1.1-.7-1.8-.7H5c-.6 0-1.1.4-1.4.9l-1.4 2.9A3.7 3.7 0 0 0 2 12v4c0 .6.4 1 1 1h2"/><circle cx="7" cy="17" r="2"/><circle cx="17" cy="17" r="2"/></svg>`,
    'plumbing': `<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M14 7l-4.5 4.5"/><path d="m9.5 11.5-2.829 2.829a2 2 0 1 0 2.829 2.828L12.328 14.5"/><path d="M17.5 6.5 19 5a4 4 0 0 1 0 5.66l-1.5 1.5"/><path d="m3 3 18 18"/></svg>`,
    'default': `<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="3" width="18" height="18" rx="2"/><path d="M9 9h6v6H9z"/></svg>`
  };
  return icons[orderType] || icons['default'];
}

/**
 * Debounce function
 * @param {Function} func
 * @param {number} wait
 * @returns {Function}
 */
function debounce(func, wait) {
  let timeout;
  return function executedFunction(...args) {
    const later = () => {
      clearTimeout(timeout);
      func(...args);
    };
    clearTimeout(timeout);
    timeout = setTimeout(later, wait);
  };
}

/**
 * Simple toast notification
 * @param {string} message
 * @param {string} type - 'success' | 'error' | 'info'
 */
function showToast(message, type = 'info') {
  const existingToast = document.querySelector('.toast');
  if (existingToast) {
    existingToast.remove();
  }

  const toast = document.createElement('div');
  toast.className = `toast toast-${type}`;
  toast.textContent = message;
  document.body.appendChild(toast);

  requestAnimationFrame(() => {
    toast.classList.add('toast-visible');
  });

  setTimeout(() => {
    toast.classList.remove('toast-visible');
    setTimeout(() => toast.remove(), 300);
  }, 3000);
}

/**
 * Check if date is overdue
 * @param {string} dateString
 * @returns {boolean}
 */
function isOverdue(dateString) {
  return new Date(dateString) < new Date();
}

/**
 * Sanitize HTML to prevent XSS
 * @param {string} str
 * @returns {string}
 */
function sanitizeHTML(str) {
  const div = document.createElement('div');
  div.textContent = str;
  return div.innerHTML;
}

if (typeof module !== 'undefined' && module.exports) {
  module.exports = {
    formatRelativeTime,
    formatDate,
    getStatusColor,
    getStatusLabel,
    getPriorityColor,
    getPriorityLabel,
    getOrderTypeIcon,
    debounce,
    showToast,
    isOverdue,
    sanitizeHTML
  };
}
