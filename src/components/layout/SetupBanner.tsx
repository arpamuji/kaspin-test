import React from 'react';
import { IconAlertCircle } from '@tabler/icons-react';

interface SetupBannerProps {
  onSetup: () => void;
}

export function SetupBanner({ onSetup }: SetupBannerProps) {
  return (
    <div className="border-kasirpintar-gold-200 bg-kasirpintar-gold-50 m-4 rounded-2xl border p-4">
      <div className="flex items-start gap-3">
        <div className="bg-kasirpintar-gold-100 flex h-10 w-10 shrink-0 items-center justify-center rounded-xl">
          <IconAlertCircle className="text-kasirpintar-gold-600 h-5 w-5" />
        </div>
        <div className="flex-1">
          <h3 className="text-kasirpintar-gold-900 mb-1 font-bold">
            Setup Diperlukan
          </h3>
          <p className="text-kasirpintar-gold-700 mb-3 text-sm">
            Masukkan QRIS statis Anda dan buat PIN untuk mulai menghasilkan QRIS
            dinamis.
          </p>
          <button
            onClick={onSetup}
            className="bg-kasirpintar-gold-500 hover:bg-kasirpintar-gold-600 w-full rounded-xl px-4 py-2.5 text-sm font-semibold text-white transition-colors"
          >
            Setup Sekarang
          </button>
        </div>
      </div>
    </div>
  );
}
