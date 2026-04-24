import React from 'react';
import { PinInput } from './PinInput';
import { IconX, IconLock } from '@tabler/icons-react';

interface PinModalProps {
  isOpen: boolean;
  title: string;
  variant?: 'verify' | 'setup';
  error?: string;
  onSubmit: (pin: string, confirmPin?: string) => void | Promise<void>;
  onClose: () => void;
}

export function PinModal({
  isOpen,
  title,
  variant = 'verify',
  error,
  onSubmit,
  onClose,
}: PinModalProps) {
  const [pin, setPin] = React.useState('');
  const [confirmPin, setConfirmPin] = React.useState('');
  const [confirmError, setConfirmError] = React.useState('');
  const [setupKey, setSetupKey] = React.useState(0);

  React.useEffect(() => {
    if (isOpen) {
      setPin('');
      setConfirmPin('');
      setConfirmError('');
    }
  }, [isOpen]);

  React.useEffect(() => {
    if (variant === 'setup') {
      setPin('');
      setConfirmPin('');
      setConfirmError('');
      setSetupKey((k) => k + 1);
    }
  }, [variant]);

  const handleSubmit = React.useCallback(async () => {
    if (variant === 'setup') {
      if (pin !== confirmPin) {
        setConfirmError('PIN tidak cocok');
        return;
      }
      await onSubmit(pin, confirmPin);
    } else {
      await onSubmit(pin);
    }
  }, [variant, pin, confirmPin, onSubmit]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 backdrop-blur-sm">
      <div className="w-full max-w-sm rounded-3xl bg-white p-6 shadow-2xl">
        <div className="mb-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <IconLock className="h-5 w-5 text-gray-400" />
            <h2 className="text-xl font-bold text-gray-900">{title}</h2>
          </div>
          <button
            onClick={onClose}
            className="rounded-lg p-1 transition-colors hover:bg-gray-100"
          >
            <IconX className="h-5 w-5 text-gray-400" />
          </button>
        </div>

        <p className="mb-6 text-sm text-gray-500">
          {variant === 'verify'
            ? 'Masukkan 6 digit PIN Anda'
            : 'Buat 6 digit PIN baru'}
        </p>

        <div className="space-y-4">
          <PinInput
            key={setupKey}
            value={pin}
            onChange={setPin}
            error={error}
            length={6}
          />

          {variant === 'setup' && (
            <>
              <div className="text-center">
                <p className="mb-2 text-xs text-gray-400">Konfirmasi PIN</p>
                <PinInput
                  key={setupKey}
                  value={confirmPin}
                  onChange={setConfirmPin}
                  error={confirmError}
                  length={6}
                  autoFocus={false}
                />
              </div>
            </>
          )}

          <div className="flex gap-3 pt-4">
            <button
              onClick={onClose}
              className="flex-1 rounded-xl px-4 py-3 font-semibold text-gray-600 transition-colors hover:bg-gray-100"
            >
              Batal
            </button>
            <button
              onClick={handleSubmit}
              disabled={
                pin.length !== 6 ||
                (variant === 'setup' && confirmPin.length !== 6)
              }
              className="bg-kasirpintar-teal-600 hover:bg-kasirpintar-teal-700 flex-1 rounded-xl px-4 py-3 font-semibold text-white transition-colors disabled:cursor-not-allowed disabled:bg-gray-300"
            >
              Lanjut
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
