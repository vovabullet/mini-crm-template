import type { ReactElement, SVGProps } from 'react';
import type { OrderType } from '../types';

type IconProps = SVGProps<SVGSVGElement>;

const line = {
  fill: 'none',
  stroke: 'currentColor',
  strokeWidth: 2,
} as const;

const lineRound = {
  ...line,
  strokeLinecap: 'round',
  strokeLinejoin: 'round',
} as const;

export function ClockIcon({ width = 16, height = 16, ...props }: IconProps) {
  return (
    <svg width={width} height={height} viewBox="0 0 24 24" {...line} {...props}>
      <circle cx="12" cy="12" r="10" />
      <path d="M12 6v6l4 2" />
    </svg>
  );
}

export function PhoneIcon({ width = 20, height = 20, ...props }: IconProps) {
  return (
    <svg width={width} height={height} viewBox="0 0 24 24" {...line} {...props}>
      <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z" />
    </svg>
  );
}

export function LocationIcon({ width = 16, height = 16, ...props }: IconProps) {
  return (
    <svg width={width} height={height} viewBox="0 0 24 24" {...line} {...props}>
      <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" />
      <circle cx="12" cy="10" r="3" />
    </svg>
  );
}

export function InfoIcon({ width = 20, height = 20, ...props }: IconProps) {
  return (
    <svg width={width} height={height} viewBox="0 0 24 24" {...line} {...props}>
      <circle cx="12" cy="12" r="10" />
      <path d="M12 16v-4M12 8h.01" />
    </svg>
  );
}

export function ArrowLeftIcon({ width = 24, height = 24, ...props }: IconProps) {
  return (
    <svg width={width} height={height} viewBox="0 0 24 24" {...line} {...props}>
      <path d="M19 12H5M12 19l-7-7 7-7" />
    </svg>
  );
}

export function ChevronDownIcon({ width = 16, height = 16, ...props }: IconProps) {
  return (
    <svg width={width} height={height} viewBox="0 0 24 24" {...line} {...props}>
      <path d="m6 9 6 6 6-6" />
    </svg>
  );
}

export function ChevronLeftIcon({ width = 32, height = 32, ...props }: IconProps) {
  return (
    <svg width={width} height={height} viewBox="0 0 24 24" {...line} {...props}>
      <path d="m15 18-6-6 6-6" />
    </svg>
  );
}

export function ChevronRightIcon({ width = 32, height = 32, ...props }: IconProps) {
  return (
    <svg width={width} height={height} viewBox="0 0 24 24" {...line} {...props}>
      <path d="m9 18 6-6-6-6" />
    </svg>
  );
}

export function CloseIcon({ width = 24, height = 24, ...props }: IconProps) {
  return (
    <svg width={width} height={height} viewBox="0 0 24 24" {...line} {...props}>
      <path d="M18 6 6 18M6 6l12 12" />
    </svg>
  );
}

export function EmptyStateIcon({ width = 64, height = 64, ...props }: IconProps) {
  return (
    <svg width={width} height={height} viewBox="0 0 24 24" {...line} {...props}>
      <circle cx="12" cy="12" r="10" />
      <path d="M12 6v6l4 2" />
    </svg>
  );
}

const ORDER_TYPE_ICONS: Record<string, ReactElement> = {
  confectionery: (
    <svg width="24" height="24" viewBox="0 0 24 24" {...lineRound}>
      <path d="M20 21v-8a2 2 0 0 0-2-2H6a2 2 0 0 0-2 2v8" />
      <path d="M4 16s.5-1 2-1 2.5 2 4 2 2.5-2 4-2 2.5 2 4 2 2-1 2-1" />
      <path d="M2 21h20" />
      <path d="M7 8v3" />
      <path d="M12 8v3" />
      <path d="M17 8v3" />
      <path d="M7 4h10v4H7z" />
    </svg>
  ),
  auto: (
    <svg width="24" height="24" viewBox="0 0 24 24" {...lineRound}>
      <path d="M19 17h2c.6 0 1-.4 1-1v-3c0-.9-.7-1.7-1.5-1.9C18.7 10.6 16 10 16 10s-1.3-1.4-2.2-2.3c-.5-.4-1.1-.7-1.8-.7H5c-.6 0-1.1.4-1.4.9l-1.4 2.9A3.7 3.7 0 0 0 2 12v4c0 .6.4 1 1 1h2" />
      <circle cx="7" cy="17" r="2" />
      <circle cx="17" cy="17" r="2" />
    </svg>
  ),
  plumbing: (
    <svg width="24" height="24" viewBox="0 0 24 24" {...lineRound}>
      <path d="M14 7l-4.5 4.5" />
      <path d="m9.5 11.5-2.829 2.829a2 2 0 1 0 2.829 2.828L12.328 14.5" />
      <path d="M17.5 6.5 19 5a4 4 0 0 1 0 5.66l-1.5 1.5" />
      <path d="m3 3 18 18" />
    </svg>
  ),
  default: (
    <svg width="24" height="24" viewBox="0 0 24 24" {...lineRound}>
      <rect x="3" y="3" width="18" height="18" rx="2" />
      <path d="M9 9h6v6H9z" />
    </svg>
  ),
};

/**
 * Icon component for an order type
 */
export function OrderTypeIcon({ orderType }: { orderType: OrderType }) {
  return ORDER_TYPE_ICONS[orderType] ?? ORDER_TYPE_ICONS.default;
}
