import React from 'react';
import {
  storage,
  qrisStorage,
  pinStorage,
  setupAtStorage,
} from '@/lib/utils/storage';
import { hashValue } from '@/lib/utils/crypto';

interface SetupState {
  qrisString: string | null;
  pin: string | null;
  setupAt: number | null;
  isLoading: boolean;
}

interface UseSetupStateReturn {
  qrisString: string | null;
  pin: string | null;
  setupAt: number | null;
  isLoading: boolean;
  saveSetup: (qris: string, pin: string) => Promise<void>;
  clearData: () => void;
  changePin: (newPin: string) => Promise<void>;
  changeQris: (newQris: string) => void;
  refresh: () => void;
}

export function useSetupState(): UseSetupStateReturn {
  const [state, setState] = React.useState<SetupState>({
    qrisString: null,
    pin: null,
    setupAt: null,
    isLoading: true,
  });

  const loadFromStorage = React.useCallback(() => {
    setState({
      qrisString: qrisStorage.get(),
      pin: pinStorage.get(),
      setupAt: setupAtStorage.get(),
      isLoading: false,
    });
  }, []);

  React.useEffect(() => {
    loadFromStorage();
  }, [loadFromStorage]);

  const saveSetup = React.useCallback(async (qris: string, pin: string) => {
    const hashedPin = await hashValue(pin);
    qrisStorage.set(qris);
    pinStorage.set(hashedPin);
    setupAtStorage.set(Date.now());

    setState((prev) => ({
      ...prev,
      qrisString: qris,
      pin: hashedPin,
      setupAt: Date.now(),
    }));
  }, []);

  const clearData = React.useCallback(() => {
    storage.clear();
    setState({
      qrisString: null,
      pin: null,
      setupAt: null,
      isLoading: false,
    });
  }, []);

  const changePin = React.useCallback(async (newPin: string) => {
    const hashedPin = await hashValue(newPin);
    pinStorage.set(hashedPin);
    setState((prev) => ({ ...prev, pin: hashedPin }));
  }, []);

  const changeQris = React.useCallback((newQris: string) => {
    qrisStorage.set(newQris);
    setState((prev) => ({ ...prev, qrisString: newQris }));
  }, []);

  return {
    ...state,
    saveSetup,
    clearData,
    changePin,
    changeQris,
    refresh: loadFromStorage,
  };
}
