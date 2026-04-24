import React from 'react';
import { Header } from '@/components/layout';
import { SetupBanner } from '@/components/layout';
import { QRDisplay } from '@/components/qr';
import { MainView } from '@/views/MainView';
import { SetupView } from '@/views/SetupView';
import { SettingsView } from '@/views/SettingsView';
import { useSetupState } from '@/hooks/useSetupState';
import { useQRISGeneration } from '@/hooks/useQRISGeneration';
import { validateQRIS, parseQRIS } from '@/lib/qris';

const Notification = ({
  message,
  visible,
}: {
  message: string;
  visible: boolean;
}) =>
  visible ? (
    <div className="fixed bottom-4 left-1/2 z-50 -translate-x-1/2 rounded-xl bg-gray-900 px-4 py-2 text-sm font-medium text-white shadow-lg">
      {message}
    </div>
  ) : null;

type View = 'main' | 'setup' | 'settings' | 'qr';

function App() {
  const [currentView, setCurrentView] = React.useState<View>('main');
  const [showNotification, setShowNotification] = React.useState(false);
  const [notificationMessage, setNotificationMessage] = React.useState('');

  const {
    qrisString,
    pin,
    saveSetup,
    clearData,
    changePin,
    changeQris,
    isLoading,
  } = useSetupState();

  const {
    amount,
    feeType,
    feeValue,
    generatedQR,
    error,
    setAmount,
    setFeeType,
    setFeeValue,
    generate,
    reset: resetGeneration,
  } = useQRISGeneration();

  const showToast = React.useCallback((message: string) => {
    setNotificationMessage(message);
    setShowNotification(true);
  }, []);

  React.useEffect(() => {
    if (showNotification) {
      const timeoutId = setTimeout(() => setShowNotification(false), 2000);
      return () => clearTimeout(timeoutId);
    }
  }, [showNotification]);

  const handleSetupComplete = React.useCallback(
    async (qris: string, newPin: string) => {
      const validation = validateQRIS(qris);
      if (!validation.valid) {
        showToast('QRIS tidak valid');
        return;
      }

      await saveSetup(qris, newPin);
      showToast('Setup berhasil!');
      setCurrentView('main');
    },
    [saveSetup, showToast]
  );

  const handleGenerate = React.useCallback(() => {
    if (!qrisString || !pin) {
      showToast('Setup belum lengkap');
      return;
    }

    const success = generate(qrisString);
    if (success) {
      setCurrentView('qr');
    }
  }, [qrisString, pin, generate, showToast]);

  const handleDownloadQR = React.useCallback(() => {
    if (!generatedQR) return;

    const svg = document.querySelector('#qr-code-content svg');
    if (!svg) {
      console.error('[QR Download] SVG element not found');
      return;
    }

    console.log('[QR Download] SVG found');

    const canvas = document.createElement('canvas');
    canvas.width = 1024;
    canvas.height = 1024;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Wrap the QR SVG in a larger SVG with padding
    const originalSvg = svg as SVGSVGElement;

    const padding = 80;
    const qrSize = 1024 - padding * 2; // 864
    const innerPad = 16;
    const svgSize = qrSize - innerPad * 2; // 832

    const svgEl = originalSvg.cloneNode(true) as SVGSVGElement;
    const svgW = svgEl.viewBox.baseVal.width || 256;
    const svgH = svgEl.viewBox.baseVal.height || 256;
    const scaleX = svgSize / svgW;
    const scaleY = svgSize / svgH;

    // Extract inner elements and wrap in scaled group
    const innerContent = svgEl.innerHTML;

    const wrapperSvg = `<svg xmlns="http://www.w3.org/2000/svg" width="1024" height="1024" viewBox="0 0 1024 1024">
      <rect width="1024" height="1024" fill="#ffffff"/>
      <rect x="${padding}" y="${padding}" width="${qrSize}" height="${qrSize}" fill="#ffffff" stroke="#d1d5db" stroke-width="2" rx="12"/>
      <g transform="translate(${padding + innerPad}, ${padding + innerPad}) scale(${scaleX}, ${scaleY})">
        ${innerContent}
      </g>
    </svg>`;

    const svgBlob = new Blob([wrapperSvg], {
      type: 'image/svg+xml;charset=utf-8',
    });
    const url = URL.createObjectURL(svgBlob);
    const img = new Image();
    img.onload = () => {
      ctx.drawImage(img, 0, 0, 1024, 1024);
      URL.revokeObjectURL(url);

      canvas.toBlob((blob) => {
        if (!blob) return;
        const link = document.createElement('a');
        link.download = `qris-${Date.now()}.png`;
        link.href = URL.createObjectURL(blob);
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        setTimeout(() => URL.revokeObjectURL(link.href), 1000);
        showToast('QR downloaded');
      }, 'image/png');
    };
    img.onerror = () => {
      console.error('[QR Download] Failed to load SVG as image');
      URL.revokeObjectURL(url);
    };
    img.src = url;
  }, [generatedQR, showToast]);

  const handleCloseQR = React.useCallback(() => {
    resetGeneration();
    setCurrentView('main');
  }, [resetGeneration]);

  const handleAmountChange = React.useCallback(
    (value: string) => {
      const numValue = Number(value);
      setAmount(isNaN(numValue) ? 0 : numValue);
    },
    [setAmount]
  );

  const handleClearData = React.useCallback(() => {
    clearData();
    resetGeneration();
    setCurrentView('main');
    showToast('Data cleared');
  }, [clearData, resetGeneration, showToast]);

  const handleChangeQris = React.useCallback(() => {
    setCurrentView('setup');
  }, []);

  const handleOpenSetup = React.useCallback(() => {
    setCurrentView('setup');
  }, []);

  const handleBackFromSetup = React.useCallback(() => {
    setCurrentView('main');
  }, []);

  // Loading state
  if (isLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="border-kasirpintar-teal-600 mx-auto mb-3 h-8 w-8 animate-spin rounded-full border-2 border-t-transparent" />
          <p className="text-sm text-gray-500">Loading...</p>
        </div>
      </div>
    );
  }

  // QR Display View
  if (currentView === 'qr' && generatedQR) {
    return (
      <>
        <div className="mx-auto min-h-screen max-w-lg border-x border-gray-100">
          <QRDisplay
            qrString={generatedQR}
            amount={amount}
            merchantName={
              qrisString ? parseQRIS(qrisString)?.merchantName || '' : ''
            }
            merchantCity={
              qrisString ? parseQRIS(qrisString)?.merchantCity || '' : ''
            }
            onDownload={handleDownloadQR}
            onClose={handleCloseQR}
          />
        </div>
        <Notification
          message={notificationMessage}
          visible={showNotification}
        />
      </>
    );
  }

  // Settings View
  if (currentView === 'settings') {
    return (
      <>
        <div className="mx-auto min-h-screen max-w-lg border-x border-gray-100">
          <SettingsView
            currentPin={pin || ''}
            qrisString={qrisString || ''}
            onChangePin={changePin}
            onChangeQris={handleChangeQris}
            onClearData={handleClearData}
            onBack={() => setCurrentView('main')}
          />
        </div>
        <Notification
          message={notificationMessage}
          visible={showNotification}
        />
      </>
    );
  }

  // Setup View (overlay on main page)
  if (currentView === 'setup') {
    return (
      <>
        <div className="mx-auto min-h-screen max-w-lg border-x border-gray-100 bg-gray-50">
          <div className="flex-1 overflow-y-auto">
            <SetupView
              qrisString={qrisString || ''}
              onQrisChange={(value: string) => {
                changeQris(value);
              }}
              onComplete={handleSetupComplete}
              onError={showToast}
              onBack={handleBackFromSetup}
            />
          </div>
        </div>
        <Notification
          message={notificationMessage}
          visible={showNotification}
        />
      </>
    );
  }

  // Main View
  return (
    <>
      <div className="mx-auto flex min-h-screen max-w-lg flex-col border-x border-gray-100 bg-white">
        <Header title="KasPIN" onSettings={() => setCurrentView('settings')} />

        {(!qrisString || !pin) && <SetupBanner onSetup={handleOpenSetup} />}

        <div className="flex flex-1 flex-col">
          <MainView
            balance={amount}
            feeType={feeType}
            feeValue={feeValue}
            onAmountChange={handleAmountChange}
            onFeeTypeChange={setFeeType}
            onFeeValueChange={setFeeValue}
            onGenerate={handleGenerate}
            canGenerate={amount > 0 && !!qrisString && !!pin}
          />
        </div>
      </div>

      <Notification message={notificationMessage} visible={showNotification} />
    </>
  );
}

export default App;
