import React from 'react';
import { QRISInput } from '../components/qris';
import { MerchantInfo } from '../components/qris';
import { PinModal } from '../components/common';
import { parseQRIS, validateQRIS } from '../lib/qris';
import { IconArrowLeft } from '@tabler/icons-react';

interface SetupViewProps {
  qrisString: string;
  onQrisChange: (value: string) => void;
  onComplete: (qris: string, pin: string) => void;
  onError: (error: string) => void;
  onBack: () => void;
}

export function SetupView({
  qrisString,
  onQrisChange,
  onComplete,
  onError,
  onBack,
}: SetupViewProps) {
  const [showPinModal, setShowPinModal] = React.useState(false);
  const [pinError, setPinError] = React.useState('');
  const [qrisValid, setQrisValid] = React.useState(false);

  const validationResult = validateQRIS(qrisString);

  React.useEffect(() => {
    setQrisValid(validationResult.valid && qrisString.length > 0);
  }, [validationResult, qrisString]);

  const handleSubmit = React.useCallback(() => {
    if (!qrisValid) {
      onError('QRIS tidak valid');
      return;
    }

    setShowPinModal(true);
  }, [qrisValid, onError]);

  const handlePinSubmit = React.useCallback(
    (pin: string, confirmPin?: string) => {
      if (!pin || pin.length !== 6) {
        setPinError('PIN harus 6 digit');
        return;
      }

      if (pin !== confirmPin) {
        setPinError('PIN tidak cocok');
        return;
      }

      onComplete(qrisString, pin);
    },
    [qrisString, onComplete]
  );

  const parsedQRIS = qrisString ? parseQRIS(qrisString) : null;

  return (
    <div className="space-y-6 p-4">
      <div className="mb-2">
        <button
          onClick={onBack}
          className="rounded-xl p-2 text-gray-600 transition-colors hover:bg-gray-100"
        >
          <IconArrowLeft className="h-6 w-6" />
        </button>
      </div>

      <div className="mb-6 text-center">
        <h2 className="mb-2 text-2xl font-bold text-gray-900">Setup QRIS</h2>
        <p className="text-sm text-gray-500">
          Masukkan QRIS statis Anda untuk mulai menghasilkan QRIS dinamis
        </p>
      </div>

      <QRISInput
        value={qrisString}
        onChange={onQrisChange}
        errors={validationResult.valid ? [] : validationResult.errors}
      />

      {parsedQRIS && qrisValid && (
        <MerchantInfo data={parsedQRIS} showAmount={false} />
      )}

      <button
        onClick={handleSubmit}
        disabled={!qrisValid}
        className="bg-kasirpintar-teal-600 hover:bg-kasirpintar-teal-700 w-full rounded-2xl py-4 font-semibold text-white transition-colors disabled:cursor-not-allowed disabled:bg-gray-300"
      >
        Setup PIN
      </button>

      <PinModal
        isOpen={showPinModal}
        title="Buat PIN"
        variant="setup"
        error={pinError}
        onSubmit={handlePinSubmit}
        onClose={() => {
          setShowPinModal(false);
          setPinError('');
        }}
      />
    </div>
  );
}
