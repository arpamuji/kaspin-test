import React from 'react';
import { IconSettings, IconArrowLeft } from '@tabler/icons-react';
import logo from '@/assets/logo.svg';

interface HeaderProps {
  title?: string;
  onSettings?: () => void;
  showBack?: boolean;
  onBack?: () => void;
}

export function Header({
  title = 'KasPIN',
  onSettings,
  showBack = false,
  onBack,
}: HeaderProps) {
  return (
    <div className="flex items-center justify-between border-b border-gray-100 bg-white p-4">
      <div className="flex items-center gap-2">
        {showBack && onBack && (
          <button
            onClick={onBack}
            className="rounded-xl p-2 text-gray-600 transition-colors hover:bg-gray-100"
          >
            <IconArrowLeft className="h-6 w-6" />
          </button>
        )}
        <img src={logo} alt="KasPIN" className="h-10 w-auto" />
      </div>
      {onSettings && (
        <button
          onClick={onSettings}
          className="rounded-xl p-2 text-gray-600 transition-colors hover:bg-gray-100"
        >
          <IconSettings className="h-6 w-6" />
        </button>
      )}
    </div>
  );
}
