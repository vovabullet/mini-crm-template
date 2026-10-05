import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useRef,
  useState,
  type ReactNode,
} from 'react';
import type { ToastType } from '../types';

type ShowToast = (message: string, type?: ToastType) => void;

const ToastContext = createContext<ShowToast>(() => {});

/**
 * Access the toast notifier from any component
 */
export function useToast(): ShowToast {
  return useContext(ToastContext);
}

interface ToastState {
  id: number;
  message: string;
  type: ToastType;
}

function ToastItem({ message, type }: { message: string; type: ToastType }) {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const frame = requestAnimationFrame(() => setVisible(true));
    return () => cancelAnimationFrame(frame);
  }, []);

  return (
    <div className={`toast toast-${type}${visible ? ' toast-visible' : ''}`}>
      {message}
    </div>
  );
}

const VISIBLE_MS = 3000;

export function ToastProvider({ children }: { children: ReactNode }) {
  const [toast, setToast] = useState<ToastState | null>(null);
  const timerRef = useRef<number | undefined>(undefined);

  const showToast = useCallback<ShowToast>((message, type = 'info') => {
    window.clearTimeout(timerRef.current);
    setToast({ id: Date.now(), message, type });
    timerRef.current = window.setTimeout(() => setToast(null), VISIBLE_MS);
  }, []);

  useEffect(() => () => window.clearTimeout(timerRef.current), []);

  return (
    <ToastContext.Provider value={showToast}>
      {children}
      {toast && <ToastItem key={toast.id} message={toast.message} type={toast.type} />}
    </ToastContext.Provider>
  );
}
