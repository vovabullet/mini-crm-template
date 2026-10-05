import { useEffect, useState } from 'react';
import { updateOrderStatus } from '../data/dataService';
import { useOrder } from '../hooks/useOrders';
import { useToast } from '../context/ToastProvider';
import type { Order, OrderStatus } from '../types';
import {
  getPriorityColor,
  getPriorityLabel,
  getStatusColor,
  getStatusLabel,
} from '../utils/labels';
import { formatDate, formatRelativeTime, isOverdue } from '../utils/format';
import {
  ArrowLeftIcon,
  ChevronDownIcon,
  InfoIcon,
  LocationIcon,
  OrderTypeIcon,
  PhoneIcon,
} from '../utils/icons';
import { LazyImage } from './LazyImage';
import { PhotoViewer } from './PhotoViewer';

const STATUS_CYCLE: OrderStatus[] = ['new', 'in-progress', 'completed'];

interface OrderDetailProps {
  orderId: string;
  onBack: () => void;
}

export function OrderDetail({ orderId, onBack }: OrderDetailProps) {
  const { order, setOrder, loading } = useOrder(orderId);
  const showToast = useToast();
  const [photoIndex, setPhotoIndex] = useState<number | null>(null);

  useEffect(() => {
    if (!loading && !order) {
      showToast('Заказ не найден', 'error');
    }
  }, [loading, order, showToast]);

  const applyStatus = async (newStatus: OrderStatus) => {
    const updated = await updateOrderStatus(orderId, newStatus);
    if (updated) {
      setOrder(updated);
      showToast('Статус обновлён', 'success');
    }
  };

  if (loading || !order) {
    return (
      <div className="view">
        <div className="detail-header">
          <button type="button" className="back-button" aria-label="Назад" onClick={onBack}>
            <ArrowLeftIcon />
          </button>
          <div className="detail-header-content">
            <h1>{loading ? 'Загрузка…' : 'Заказ не найден'}</h1>
          </div>
        </div>
      </div>
    );
  }

  const statusClass = getStatusColor(order.status);
  const isLate = order.status !== 'completed' && isOverdue(order.dueDate);

  return (
    <div className="view">
      <div className="detail-header">
        <button type="button" className="back-button" aria-label="Назад" onClick={onBack}>
          <ArrowLeftIcon />
        </button>
        <div className="detail-header-content">
          <h1>{order.orderNumber}</h1>
          <button
            type="button"
            className={`status-badge ${statusClass} status-button`}
            onClick={() => {
              const nextStatus =
                STATUS_CYCLE[(STATUS_CYCLE.indexOf(order.status) + 1) % STATUS_CYCLE.length];
              void applyStatus(nextStatus);
            }}
          >
            {getStatusLabel(order.status)}
            <ChevronDownIcon />
          </button>
        </div>
      </div>

      <div className="detail-body">
        <section className="card customer-card">
          <div className="card-header">
            <div className="order-type-badge">
              <OrderTypeIcon orderType={order.orderType} />
              <span>{order.orderTypeLabel}</span>
            </div>
          </div>
          <h2>{order.customerName}</h2>
          <div className="customer-actions">
            <a href={`tel:${order.customerPhone}`} className="btn btn-secondary">
              <PhoneIcon />
              Позвонить
            </a>
          </div>
          {order.address && (
            <div className="info-row">
              <LocationIcon />
              <span>{order.address}</span>
            </div>
          )}
        </section>

        <section className="card order-details-card">
          <h3>Детали заказа</h3>
          <div className="detail-row">
            <span className="label">Описание</span>
            <p>{order.description}</p>
          </div>
          <div className="detail-row">
            <span className="label">Срок выполнения</span>
            <p className={isLate ? 'overdue' : undefined}>{formatDate(order.dueDate)}</p>
          </div>
          {order.priority === 'high' && (
            <div className="detail-row">
              <span className="label">Приоритет</span>
              <span className={`priority-badge ${getPriorityColor(order.priority)}`}>
                {getPriorityLabel(order.priority)}
              </span>
            </div>
          )}
          {order.startedAt && (
            <div className="detail-row">
              <span className="label">Начато</span>
              <p>{formatRelativeTime(order.startedAt)}</p>
            </div>
          )}
          {order.completedAt && (
            <div className="detail-row">
              <span className="label">Завершено</span>
              <p>{formatDate(order.completedAt)}</p>
            </div>
          )}
        </section>

        {order.specialInstructions && (
          <section className="card special-instructions">
            <h3>
              <InfoIcon />
              Особые указания
            </h3>
            <p>{order.specialInstructions}</p>
          </section>
        )}

        {order.photos.length > 0 && (
          <section className="card photos-card">
            <h3>Фотографии ({order.photos.length})</h3>
            <div className="photo-grid">
              {order.photos.map((photo, index) => (
                <button
                  key={photo.id}
                  type="button"
                  className="photo-item"
                  onClick={() => setPhotoIndex(index)}
                >
                  <LazyImage src={photo.thumbnail} alt={`Order photo ${index + 1}`} />
                </button>
              ))}
            </div>
          </section>
        )}
      </div>

      <div className="detail-footer">
        <StatusActionButton order={order} onAction={applyStatus} />
      </div>

      {photoIndex !== null && (
        <PhotoViewer
          photos={order.photos}
          startIndex={photoIndex}
          onClose={() => setPhotoIndex(null)}
        />
      )}
    </div>
  );
}

function StatusActionButton({
  order,
  onAction,
}: {
  order: Order;
  onAction: (status: OrderStatus) => void;
}) {
  if (order.status === 'completed') {
    return <div className="completed-badge">✓ Заказ завершён</div>;
  }

  const isNew = order.status === 'new';
  return (
    <button
      type="button"
      className="btn btn-primary btn-block"
      onClick={() => onAction(isNew ? 'in-progress' : 'completed')}
    >
      {isNew ? 'Начать работу' : 'Завершить заказ'}
    </button>
  );
}
