import type { ToastMessage } from '../types';

interface ToastProps {
  toast: ToastMessage | null;
}

const toastStyles: Record<ToastMessage['type'], string> = {
  success: 'bg-emerald-600/90 border-emerald-500/50',
  error: 'bg-rose-600/90 border-rose-500/50',
  info: 'bg-violet-600/90 border-violet-500/50',
};

export default function Toast({ toast }: ToastProps) {
  if (!toast) return null;

  return (
    <div
      className={`fixed bottom-4 right-4 z-50 rounded-lg border px-6 py-3 text-sm font-medium text-white shadow-2xl backdrop-blur-sm transition-all duration-300 ${toastStyles[toast.type]}`}
    >
      {toast.message}
    </div>
  );
}
