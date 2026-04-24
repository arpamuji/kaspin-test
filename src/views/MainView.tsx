import React from 'react';
import { AmountDisplay } from '../components/amount';
import { FeeSelector } from '../components/amount';
import { IconQrcode } from '@tabler/icons-react';

interface NumericKeypadProps {
  value: string;
  onChange: (value: string) => void;
  disabled?: boolean;
}

const KEYS = [
  ['7', '8', '9'],
  ['4', '5', '6'],
  ['1', '2', '3'],
  ['0', 'C', '⌫'],
] as const;

function NumericKeypad({
  value,
  onChange,
  disabled = false,
}: NumericKeypadProps) {
  const handlePress = React.useCallback(
    (key: string) => {
      if (disabled) return;

      if (key === 'C') {
        onChange('');
        return;
      }

      if (key === '⌫') {
        onChange(value.slice(0, -1));
        return;
      }

      // Prevent multiple leading zeros
      if (key === '0' && value === '') return;
      if (value === '0') return;

      onChange(value + key);
    },
    [disabled, onChange, value]
  );

  // Physical keyboard listener
  React.useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      const tag = (e.target as HTMLElement)?.tagName;
      if (tag === 'INPUT' || tag === 'TEXTAREA') return;

      if (/^[0-9]$/.test(e.key)) {
        e.preventDefault();
        handlePress(e.key);
      } else if (e.key === 'Backspace') {
        e.preventDefault();
        handlePress('⌫');
      } else if (e.key === 'Escape' || e.key === 'Delete') {
        e.preventDefault();
        handlePress('C');
      } else if (e.key === 'Enter') {
        const btn = document.querySelector(
          '[aria-label="Generate QRIS"]'
        ) as HTMLButtonElement;
        btn?.click();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [handlePress]);

  return (
    <div className="grid grid-cols-3 gap-3 p-4">
      {KEYS.map((row) =>
        row.map((key) => (
          <button
            key={key}
            onClick={() => handlePress(key)}
            disabled={disabled}
            className={`h-16 rounded-2xl text-2xl font-semibold transition-all active:scale-95 ${
              key === 'C'
                ? 'bg-red-100 text-red-600 hover:bg-red-200'
                : key === '⌫'
                  ? 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                  : 'bg-gray-50 text-gray-900 hover:bg-gray-100'
            } ${disabled ? 'cursor-not-allowed opacity-50' : ''} `}
          >
            {key}
          </button>
        ))
      )}
    </div>
  );
}

interface MainViewProps {
  balance: number;
  feeType: 'none' | 'fixed' | 'percentage';
  feeValue: number;
  onAmountChange: (value: string) => void;
  onFeeTypeChange: (type: 'none' | 'fixed' | 'percentage') => void;
  onFeeValueChange: (value: number) => void;
  onGenerate: () => void;
  canGenerate: boolean;
}

export function MainView({
  balance,
  feeType,
  feeValue,
  onAmountChange,
  onFeeTypeChange,
  onFeeValueChange,
  onGenerate,
  canGenerate,
}: MainViewProps) {
  const [amountValue, setAmountValue] = React.useState('');

  const handleAmountChange = React.useCallback(
    (value: string) => {
      setAmountValue(value);
      onAmountChange(value);
    },
    [onAmountChange]
  );

  return (
    <div className="flex flex-1 flex-col">
      {/* Amount Display - Bottom Section with Increased Height */}
      <div className="from-kasirpintar-teal-600 to-kasirpintar-teal-700 flex flex-1 flex-col items-center justify-center bg-linear-to-br p-6 transition-all">
        <div className="w-full text-center">
          <p className="text-kasirpintar-teal-100 mb-3 text-sm font-medium">
            Payment Amount
          </p>
          <div className="text-white">
            <AmountDisplay amount={balance} label="" />
          </div>
        </div>
      </div>

      {/* Card Section - Fee Selector, Keypad, and Generate Button */}
      <div className="rounded-t-3xl border-t border-gray-100 bg-white shadow-2xl">
        {/* Fee Selector */}
        <div className="border-b border-gray-100 p-4">
          <FeeSelector
            feeType={feeType}
            onChange={onFeeTypeChange}
            fixedValue={feeValue}
            percentageValue={feeValue}
            onFixedChange={onFeeValueChange}
            onPercentageChange={onFeeValueChange}
          />
        </div>

        {/* Numeric Keypad */}
        <NumericKeypad value={amountValue} onChange={handleAmountChange} />

        {/* Generate Button - Fixed at Bottom */}
        <div className="border-t border-gray-100 p-4">
          <button
            aria-label="Generate QRIS"
            onClick={onGenerate}
            disabled={!canGenerate}
            className="bg-kasirpintar-teal-600 shadow-kasirpintar-teal-600/20 hover:bg-kasirpintar-teal-700 flex w-full items-center justify-center gap-2 rounded-2xl py-4 font-semibold text-white shadow-lg transition-colors disabled:cursor-not-allowed disabled:bg-gray-300"
          >
            <IconQrcode className="h-6 w-6" />
            Generate QRIS
          </button>
        </div>
      </div>
    </div>
  );
}
