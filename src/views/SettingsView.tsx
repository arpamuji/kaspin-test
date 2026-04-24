import React from 'react';
import { ConfirmDialog, PinModal } from '../components/common';
import {
  IconSettings,
  IconKey,
  IconQrcode,
  IconTrash,
  IconArrowLeft,
  IconInfoCircle,
} from '@tabler/icons-react';
import { hashValue } from '@/lib/utils/crypto';

interface SettingsViewProps {
  currentPin: string;
  qrisString: string;
  onChangePin: (newPin: string) => void;
  onChangeQris: () => void;
  onClearData: () => void;
  onBack: () => void;
}

export function SettingsView({
  currentPin,
  qrisString,
  onChangePin,
  onChangeQris,
  onClearData,
  onBack,
}: SettingsViewProps) {
  const [showPinModal, setShowPinModal] = React.useState(false);
  const [pinError, setPinError] = React.useState('');
  const [showClearConfirm, setShowClearConfirm] = React.useState(false);
  const [step, setStep] = React.useState<'verify' | 'setup'>('verify');
  const [pendingAction, setPendingAction] = React.useState<
    'changeQris' | 'changePin' | 'clearData' | null
  >(null);

  const handleVerifyPin = React.useCallback(
    async (pin: string) => {
      const hashedInput = await hashValue(pin);
      if (hashedInput !== currentPin) {
        setPinError('PIN salah');
        return;
      }
      // PIN verified — execute pending action
      if (pendingAction === 'changeQris') {
        setShowPinModal(false);
        setPendingAction(null);
        onChangeQris();
      } else if (pendingAction === 'clearData') {
        setShowPinModal(false);
        setPendingAction(null);
        setShowClearConfirm(true);
      } else {
        // changePin or default — transition to setup mode in same modal
        setStep('setup');
        setPinError('');
      }
    },
    [currentPin, pendingAction, onChangeQris]
  );

  const handleSetupPin = React.useCallback(
    async (pin: string, confirmPin?: string) => {
      if (pin !== confirmPin) {
        setPinError('PIN tidak cocok');
        return;
      }
      await onChangePin(pin);
      setShowPinModal(false);
      setStep('verify');
      setPendingAction(null);
    },
    [onChangePin]
  );

  const openPinChange = React.useCallback(() => {
    setPendingAction('changePin');
    // Skip verify step if no PIN set yet (first-time setup)
    if (!currentPin) {
      setStep('setup');
    } else {
      setStep('verify');
    }
    setPinError('');
    setShowPinModal(true);
  }, [currentPin]);

  const openQrisChange = React.useCallback(() => {
    setPendingAction('changeQris');
    // Skip verify step if no PIN set yet (first-time setup)
    if (!currentPin) {
      setShowPinModal(false);
      onChangeQris();
    } else {
      setStep('verify');
      setPinError('');
      setShowPinModal(true);
    }
  }, [currentPin, onChangeQris]);

  const openClearConfirm = React.useCallback(() => {
    setPendingAction('clearData');
    setStep('verify');
    setPinError('');
    setShowPinModal(true);
  }, []);

  const handleClearConfirm = React.useCallback(() => {
    onClearData();
    setShowClearConfirm(false);
  }, [onClearData]);

  return (
    <div className="flex h-full flex-col">
      {/* Header */}
      <div className="flex items-center gap-3 border-b border-gray-100 p-4">
        <button
          onClick={onBack}
          className="rounded-xl p-2 transition-colors hover:bg-gray-100"
        >
          <IconArrowLeft className="h-6 w-6 text-gray-600" />
        </button>
        <h1 className="text-xl font-bold text-gray-900">Settings</h1>
      </div>

      {/* Content */}
      <div className="flex-1 space-y-4 p-4">
        {/* Change PIN */}
        <div className="rounded-2xl border border-gray-200 bg-white p-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <IconKey className="h-5 w-5 text-gray-400" />
              <div>
                <h3 className="font-semibold text-gray-900">Change PIN</h3>
                <p className="text-sm text-gray-500">Update your 6-digit PIN</p>
              </div>
            </div>
            <button
              onClick={openPinChange}
              className="text-kasirpintar-teal-600 hover:bg-kasirpintar-teal-50 rounded-xl px-4 py-2 font-semibold transition-colors"
            >
              Change
            </button>
          </div>
        </div>

        {/* Change QRIS */}
        <div className="rounded-2xl border border-gray-200 bg-white p-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <IconQrcode className="h-5 w-5 text-gray-400" />
              <div>
                <h3 className="font-semibold text-gray-900">Change QRIS</h3>
                <p className="text-sm text-gray-500">Update your static QRIS</p>
              </div>
            </div>
            <button
              onClick={openQrisChange}
              className="text-kasirpintar-teal-600 hover:bg-kasirpintar-teal-50 rounded-xl px-4 py-2 font-semibold transition-colors"
            >
              Change
            </button>
          </div>
        </div>

        {/* Clear Data */}
        <div className="rounded-2xl border border-red-200 bg-red-50 p-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <IconTrash className="h-5 w-5 text-red-400" />
              <div>
                <h3 className="font-semibold text-red-900">Clear All Data</h3>
                <p className="text-sm text-red-700">
                  Remove QRIS, PIN, and all settings
                </p>
              </div>
            </div>
            <button
              disabled={!qrisString && !currentPin}
              onClick={openClearConfirm}
              className="rounded-xl bg-red-600 px-4 py-2 font-semibold text-white transition-colors hover:bg-red-700 disabled:cursor-not-allowed disabled:bg-gray-300"
            >
              Clear
            </button>
          </div>
        </div>

        {/* Info */}
        <div className="rounded-2xl bg-gray-50 p-4">
          <div className="flex items-start gap-3">
            <IconInfoCircle className="mt-0.5 h-5 w-5 text-gray-400" />
            <div>
              <p className="text-sm text-gray-600">
                All data is stored locally on your device. Clearing data will
                permanently remove your QRIS and PIN.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* PIN Modal */}
      <PinModal
        isOpen={showPinModal}
        title={step === 'verify' ? 'Verify PIN' : 'Set New PIN'}
        variant={step === 'verify' ? 'verify' : 'setup'}
        error={pinError}
        onSubmit={step === 'verify' ? handleVerifyPin : handleSetupPin}
        onClose={() => {
          setShowPinModal(false);
          setStep('verify');
          setPinError('');
          setPendingAction(null);
        }}
      />

      {/* Clear Confirmation */}
      <ConfirmDialog
        isOpen={showClearConfirm}
        title="Clear All Data?"
        message="This action cannot be undone. All your QRIS data and PIN will be permanently removed."
        variant="danger"
        confirmText="Clear All"
        onConfirm={handleClearConfirm}
        onCancel={() => setShowClearConfirm(false)}
      />
    </div>
  );
}
