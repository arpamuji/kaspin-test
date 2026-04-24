import React from 'react';

interface UsePINReturn {
  inputPin: string;
  error: string | null;
  setInputPin: (pin: string) => void;
  validate: (expectedPin: string) => boolean;
  reset: () => void;
}

export function usePIN(): UsePINReturn {
  const [inputPin, setInputPin] = React.useState('');
  const [error, setError] = React.useState<string | null>(null);

  const validate = React.useCallback(
    (expectedPin: string): boolean => {
      if (!inputPin) {
        setError('PIN tidak boleh kosong');
        return false;
      }

      if (inputPin.length !== 6) {
        setError('PIN harus 6 digit');
        return false;
      }

      if (inputPin !== expectedPin) {
        setError('PIN salah');
        return false;
      }

      setError(null);
      return true;
    },
    [inputPin]
  );

  const reset = React.useCallback(() => {
    setInputPin('');
    setError(null);
  }, []);

  return {
    inputPin,
    error,
    setInputPin,
    validate,
    reset,
  };
}
