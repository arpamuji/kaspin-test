import { QRCodeSVG } from 'qrcode.react';
import { formatRupiah } from '@/lib/utils';
import { IconArrowLeft, IconDownload } from '@tabler/icons-react';

interface QRDisplayProps {
  qrString: string;
  amount: number;
  merchantName: string;
  merchantCity: string;
  onDownload: () => void;
  onClose: () => void;
}

export function QRDisplay({
  qrString,
  amount,
  merchantName,
  merchantCity,
  onDownload,
  onClose,
}: QRDisplayProps) {
  return (
    <div className="flex min-h-screen flex-col bg-white">
      {/* Header */}
      <div className="flex items-center justify-between border-b border-gray-100 p-4">
        <button
          onClick={onClose}
          className="rounded-xl p-2 text-gray-600 transition-colors hover:bg-gray-100"
        >
          <IconArrowLeft className="h-6 w-6" />
        </button>
        <h1 className="text-lg font-bold text-gray-900">QR Code</h1>
        <div className="w-10" />
      </div>

      {/* Content */}
      <div className="flex flex-1 flex-col items-center justify-center space-y-6 p-6">
        {/* Merchant Info */}
        <div className="text-center">
          <p className="text-2xl font-bold text-gray-900">{merchantName}</p>
          {merchantCity && (
            <p className="mt-1 text-sm text-gray-500">{merchantCity}</p>
          )}
        </div>

        {/* QR Code */}
        <div
          id="qr-code-content"
          className="border-kasirpintar-teal-600/20 shadow-kasirpintar-teal-600/10 rounded-2xl border-4 bg-white p-6 shadow-xl"
        >
          <QRCodeSVG
            value={qrString}
            size={256}
            level="H"
            includeMargin={false}
          />
        </div>

        {/* Amount */}
        <div className="text-center">
          <p className="text-kasirpintar-teal-600 text-3xl font-bold">
            {formatRupiah(amount)}
          </p>
        </div>
      </div>

      {/* Actions */}
      <div className="space-y-3 border-t border-gray-100 p-4">
        <button
          onClick={onDownload}
          className="bg-kasirpintar-teal-600 shadow-kasirpintar-teal-600/20 hover:bg-kasirpintar-teal-700 flex w-full items-center justify-center gap-2 rounded-2xl py-4 font-semibold text-white shadow-lg transition-colors"
        >
          <IconDownload className="h-5 w-5" />
          Download PNG
        </button>
      </div>
    </div>
  );
}
