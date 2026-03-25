'use client';

import { useEffect } from 'react';
import { CheckCircle, XCircle, X } from 'lucide-react';

export type ToastMessage = {
  type: 'success' | 'error';
  title: string;
  detail?: string;
};

export default function Toast({ toast, onClose }: { toast: ToastMessage; onClose: () => void }) {
  useEffect(() => {
    const timer = setTimeout(onClose, 6000);
    return () => clearTimeout(timer);
  }, [onClose]);

  const isError = toast.type === 'error';

  return (
    <div className="fixed bottom-4 right-4 z-50 max-w-sm w-full sm:w-auto animate-in fade-in slide-in-from-bottom-2">
      <div className={`rounded-xl shadow-lg border px-4 py-3.5 flex items-start gap-3 ${
        isError ? 'bg-red-50 border-red-200' : 'bg-green-50 border-green-200'
      }`}>
        {isError
          ? <XCircle size={18} className="text-red-500 shrink-0 mt-0.5" />
          : <CheckCircle size={18} className="text-green-600 shrink-0 mt-0.5" />
        }
        <div className="flex-1 min-w-0">
          <p className={`text-sm font-semibold ${isError ? 'text-red-800' : 'text-green-800'}`}>
            {toast.title}
          </p>
          {toast.detail && (
            <p className={`text-xs mt-0.5 leading-relaxed ${isError ? 'text-red-700' : 'text-green-700'}`}>
              {toast.detail}
            </p>
          )}
        </div>
        <button onClick={onClose} className={`shrink-0 p-0.5 rounded ${isError ? 'text-red-400 hover:text-red-600' : 'text-green-400 hover:text-green-600'}`}>
          <X size={14} />
        </button>
      </div>
    </div>
  );
}
