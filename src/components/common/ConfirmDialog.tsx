import React from 'react';
import { IconAlertTriangle, IconCheck } from '@tabler/icons-react';

interface ConfirmDialogProps {
  isOpen: boolean;
  title: string;
  message: string;
  variant?: 'default' | 'danger';
  confirmText?: string;
  cancelText?: string;
  onConfirm: () => void;
  onCancel: () => void;
}

export function ConfirmDialog({
  isOpen,
  title,
  message,
  variant = 'default',
  confirmText = 'Konfirmasi',
  cancelText = 'Batal',
  onConfirm,
  onCancel,
}: ConfirmDialogProps) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 backdrop-blur-sm">
      <div className="w-full max-w-sm rounded-3xl bg-white p-6 shadow-2xl">
        <div className="mb-6 text-center">
          <div
            className={`mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full ${
              variant === 'danger'
                ? 'bg-red-100 text-red-600'
                : 'bg-kasirpintar-teal-100 text-kasirpintar-teal-600'
            }`}
          >
            {variant === 'danger' ? (
              <IconAlertTriangle className="h-6 w-6" />
            ) : (
              <IconCheck className="h-6 w-6" />
            )}
          </div>
          <h2 className="mb-2 text-xl font-bold text-gray-900">{title}</h2>
          <p className="text-sm text-gray-500">{message}</p>
        </div>

        <div className="flex gap-3">
          <button
            onClick={onCancel}
            className={`flex-1 rounded-xl px-4 py-3 font-semibold transition-colors ${
              variant === 'danger'
                ? 'text-gray-600 hover:bg-gray-100'
                : 'text-gray-600 hover:bg-gray-100'
            }`}
          >
            {cancelText}
          </button>
          <button
            onClick={onConfirm}
            className={`flex-1 rounded-xl px-4 py-3 font-semibold transition-colors ${
              variant === 'danger'
                ? 'bg-red-600 text-white hover:bg-red-700'
                : 'bg-kasirpintar-teal-600 hover:bg-kasirpintar-teal-700 text-white'
            }`}
          >
            {confirmText}
          </button>
        </div>
      </div>
    </div>
  );
}
