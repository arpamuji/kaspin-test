import React from 'react';

type FeeType = 'none' | 'fixed' | 'percentage';

interface FeeSelectorProps {
  feeType: FeeType;
  onChange: (type: FeeType) => void;
  fixedValue?: number;
  percentageValue?: number;
  onFixedChange?: (value: number) => void;
  onPercentageChange?: (value: number) => void;
  disabled?: boolean;
}

export function FeeSelector({
  feeType,
  onChange,
  fixedValue = 0,
  percentageValue = 0,
  onFixedChange,
  onPercentageChange,
  disabled = false,
}: FeeSelectorProps) {
  return (
    <div className="space-y-3">
      <div className="flex gap-2">
        <button
          onClick={() => onChange('none')}
          disabled={disabled}
          className={`flex-1 rounded-xl px-4 py-3 text-sm font-semibold transition-all ${
            feeType === 'none'
              ? 'bg-gray-900 text-white shadow-lg shadow-gray-900/20'
              : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
          } ${disabled ? 'cursor-not-allowed opacity-50' : ''}`}
        >
          None
        </button>
        <button
          onClick={() => onChange('fixed')}
          disabled={disabled}
          className={`flex-1 rounded-xl px-4 py-3 text-sm font-semibold transition-all ${
            feeType === 'fixed'
              ? 'bg-kasirpintar-teal-600 shadow-kasirpintar-teal-600/20 text-white shadow-lg'
              : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
          } ${disabled ? 'cursor-not-allowed opacity-50' : ''}`}
        >
          Fixed
        </button>
        <button
          onClick={() => onChange('percentage')}
          disabled={disabled}
          className={`flex-1 rounded-xl px-4 py-3 text-sm font-semibold transition-all ${
            feeType === 'percentage'
              ? 'bg-kasirpintar-gold-500 shadow-kasirpintar-gold-500/20 text-white shadow-lg'
              : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
          } ${disabled ? 'cursor-not-allowed opacity-50' : ''}`}
        >
          %
        </button>
      </div>

      {feeType === 'fixed' && onFixedChange && (
        <div className="relative">
          <span className="absolute top-1/2 left-4 -translate-y-1/2 font-medium text-gray-500">
            Rp
          </span>
          <input
            type="number"
            value={fixedValue}
            onChange={(e) => onFixedChange(Number(e.target.value))}
            disabled={disabled}
            placeholder="0"
            className="focus:border-kasirpintar-teal-500 w-full rounded-xl border-2 border-gray-200 py-3 pr-4 pl-10 transition-colors outline-none focus:ring-0 disabled:bg-gray-100"
          />
        </div>
      )}

      {feeType === 'percentage' && onPercentageChange && (
        <div className="relative">
          <input
            type="number"
            value={percentageValue}
            onChange={(e) => onPercentageChange(Number(e.target.value))}
            disabled={disabled}
            placeholder="0"
            className="focus:border-kasirpintar-teal-500 w-full rounded-xl border-2 border-gray-200 py-3 pr-10 pl-4 transition-colors outline-none focus:ring-0 disabled:bg-gray-100"
          />
          <span className="absolute top-1/2 right-4 -translate-y-1/2 font-medium text-gray-500">
            %
          </span>
        </div>
      )}
    </div>
  );
}
