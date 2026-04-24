import React from 'react';
import { convertQRIS } from '@/lib/qris';
import type { ConvertOptions } from '@/lib/qris';

type FeeType = 'none' | 'fixed' | 'percentage';

interface UseQRISGenerationReturn {
  amount: number;
  feeType: FeeType;
  feeValue: number;
  generatedQR: string | null;
  error: string | null;
  setAmount: (value: number) => void;
  setFeeType: (type: FeeType) => void;
  setFeeValue: (value: number) => void;
  generate: (staticQris: string) => boolean;
  reset: () => void;
}

export function useQRISGeneration(): UseQRISGenerationReturn {
  const [amount, setAmount] = React.useState<number>(0);
  const [feeType, setFeeType] = React.useState<FeeType>('none');
  const [feeValue, setFeeValue] = React.useState<number>(0);
  const [generatedQR, setGeneratedQR] = React.useState<string | null>(null);
  const [error, setError] = React.useState<string | null>(null);

  const generate = React.useCallback(
    (staticQris: string): boolean => {
      setError(null);

      if (!staticQris) {
        setError('QRIS statis tidak ditemukan');
        return false;
      }

      if (amount <= 0) {
        setError('Jumlah harus lebih dari 0');
        return false;
      }

      try {
        const options: ConvertOptions = { amount };

        if (feeType === 'fixed' && feeValue > 0) {
          options.fee = { type: 'fixed', value: feeValue };
        } else if (feeType === 'percentage' && feeValue > 0) {
          options.fee = { type: 'percentage', value: feeValue };
        }

        const dynamicQris = convertQRIS(staticQris, options);
        setGeneratedQR(dynamicQris);
        return true;
      } catch (err) {
        setError(
          err instanceof Error ? err.message : 'Gagal menghasilkan QRIS'
        );
        return false;
      }
    },
    [amount, feeType, feeValue]
  );

  const reset = React.useCallback(() => {
    setAmount(0);
    setFeeType('none');
    setFeeValue(0);
    setGeneratedQR(null);
    setError(null);
  }, []);

  return {
    amount,
    feeType,
    feeValue,
    generatedQR,
    error,
    setAmount,
    setFeeType,
    setFeeValue,
    generate,
    reset,
  };
}
