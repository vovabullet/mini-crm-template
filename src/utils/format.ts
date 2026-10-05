/**
 * Format date to relative time (e.g. "2 hours ago", "Tomorrow at 14:00")
 */
export function formatRelativeTime(dateString: string): string {
  const date = new Date(dateString);
  const now = new Date();
  const diffSeconds = Math.floor((date.getTime() - now.getTime()) / 1000);
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
    return `Завтра в ${date.toLocaleTimeString('ru-RU', {
      hour: '2-digit',
      minute: '2-digit',
    })}`;
  } else if (diffDays < 7) {
    return `Через ${diffDays} дн`;
  } else {
    return date.toLocaleDateString('ru-RU', {
      day: 'numeric',
      month: 'short',
      hour: '2-digit',
      minute: '2-digit',
    });
  }
}

/**
 * Format date to a readable string with time
 */
export function formatDate(dateString: string): string {
  const date = new Date(dateString);
  return date.toLocaleDateString('ru-RU', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });
}

/**
 * Check whether a date is in the past
 */
export function isOverdue(dateString: string): boolean {
  return new Date(dateString) < new Date();
}
