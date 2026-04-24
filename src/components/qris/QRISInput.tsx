import React, { useRef, useCallback } from 'react';
import jsQR from 'jsqr';
import { validateQRIS } from '@/lib/qris';
import {
  IconPhoto,
  IconCamera,
  IconCircleCheck,
  IconCircleX,
} from '@tabler/icons-react';

interface QRISInputProps {
  value: string;
  onChange: (value: string) => void;
  onReset?: () => void;
  errors?: string[];
}

export function QRISInput({
  value,
  onChange,
  onReset,
  errors = [],
}: QRISInputProps) {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [isScanning, setIsScanning] = React.useState(false);
  const [scanError, setScanError] = React.useState('');

  const handleTextChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const newValue = e.target.value.trim();
    onChange(newValue);
  };

  const processQRCode = useCallback(
    (data: string) => {
      onChange(data.trim());
      setIsScanning(false);
      setScanError('');
    },
    [onChange]
  );

  const scanFromImage = useCallback(
    (file: File) => {
      console.log(
        '[QRISInput] scanFromImage called with file:',
        file.name,
        file.type,
        file.size,
        'bytes'
      );

      const reader = new FileReader();
      reader.onload = async (e) => {
        console.log('[QRISInput] FileReader onload triggered');
        console.log(
          '[QRISInput] FileReader result:',
          e.target?.result ? 'exists' : 'null'
        );

        try {
          const img = new Image();

          img.onload = () => {
            console.log('[QRISInput] Image loaded successfully');
            console.log(
              '[QRISInput] Image dimensions:',
              img.width,
              'x',
              img.height
            );

            const canvas = canvasRef.current;
            if (!canvas) {
              console.error('[QRISInput] Canvas ref is null');
              setScanError('Canvas tidak tersedia');
              return;
            }

            const ctx = canvas.getContext('2d');
            if (!ctx) {
              console.error('[QRISInput] Cannot get 2D context');
              setScanError('Cannot access canvas context');
              return;
            }

            canvas.width = img.width;
            canvas.height = img.height;
            console.log(
              '[QRISInput] Canvas set to:',
              canvas.width,
              'x',
              canvas.height
            );

            ctx.drawImage(img, 0, 0);
            console.log('[QRISInput] Image drawn to canvas');

            const imageData = ctx.getImageData(
              0,
              0,
              canvas.width,
              canvas.height
            );
            console.log(
              '[QRISInput] ImageData extracted:',
              imageData.width,
              'x',
              imageData.height,
              'data length:',
              imageData.data.length
            );

            const code = jsQR(
              imageData.data,
              imageData.width,
              imageData.height
            );
            console.log(
              '[QRISInput] jsQR result:',
              code ? 'QR found!' : 'No QR detected'
            );

            if (code) {
              console.log(
                '[QRISInput] QR Data:',
                code.data.substring(0, 50) + '...'
              );
              processQRCode(code.data);
            } else {
              console.warn(
                '[QRISInput] jsQR could not detect QR code in image'
              );
              setScanError('QR code tidak terdeteksi dalam gambar');
            }
          };

          img.onerror = () => {
            console.error(
              '[QRISInput] Image onload error - failed to load image'
            );
            setScanError('Gagal memuat gambar');
          };

          console.log('[QRISInput] Setting img.src to data URL');
          img.src = e.target?.result as string;
        } catch (err) {
          console.error('[QRISInput] Exception in scanFromImage:', err);
          setScanError('Gagal memproses gambar');
        }
      };

      reader.onerror = () => {
        console.error('[QRISInput] FileReader error');
        setScanError('Gagal membaca file');
      };

      console.log('[QRISInput] Reading file as DataURL');
      reader.readAsDataURL(file);
    },
    [processQRCode]
  );

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    console.log('[QRISInput] handleFileSelect triggered');
    const file = e.target.files?.[0];
    if (file) {
      console.log(
        '[QRISInput] File selected:',
        file.name,
        file.type,
        file.size
      );
      scanFromImage(file);
    } else {
      console.warn('[QRISInput] No file selected');
    }
  };

  const handleDrop = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault();
      console.log('[QRISInput] handleDrop triggered');
      const file = e.dataTransfer.files?.[0];
      if (file && file.type.startsWith('image/')) {
        console.log(
          '[QRISInput] Dropped file:',
          file.name,
          file.type,
          file.size
        );
        scanFromImage(file);
      } else {
        console.warn('[QRISInput] Dropped file is not an image or missing');
      }
    },
    [scanFromImage]
  );

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
  };

  const startCamera = async () => {
    try {
      setIsScanning(true);
      setScanError('');

      const stream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: 'environment' },
      });

      if (videoRef.current) {
        videoRef.current.srcObject = stream;

        const checkForQR = () => {
          const video = videoRef.current;
          const canvas = canvasRef.current;
          if (!video || !canvas || video.paused || video.ended) return;

          const ctx = canvas.getContext('2d');
          if (!ctx) return;

          canvas.width = video.videoWidth;
          canvas.height = video.videoHeight;
          ctx.drawImage(video, 0, 0);

          const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
          const code = jsQR(imageData.data, imageData.width, imageData.height);

          if (code) {
            processQRCode(code.data);
            stream.getTracks().forEach((track) => track.stop());
          } else {
            setTimeout(checkForQR, 100);
          }
        };

        videoRef.current.onplay = checkForQR;
      }
    } catch (err) {
      setScanError('Tidak dapat mengakses kamera');
      setIsScanning(false);
    }
  };

  const stopCamera = () => {
    if (videoRef.current?.srcObject) {
      const stream = videoRef.current.srcObject as MediaStream;
      stream.getTracks().forEach((track) => track.stop());
    }
    setIsScanning(false);
  };

  const handlePaste = useCallback(
    (e: React.ClipboardEvent) => {
      console.log('[QRISInput] handlePaste triggered');
      const items = e.clipboardData.items;
      for (let i = 0; i < items.length; i++) {
        console.log('[QRISInput] Clipboard item:', items[i].type);
        if (items[i].type.startsWith('image/')) {
          e.preventDefault();
          const file = items[i].getAsFile();
          console.log(
            '[QRISInput] Image from clipboard:',
            file?.name,
            file?.type,
            file?.size
          );
          if (file) {
            scanFromImage(file);
          }
          return;
        }
      }
      console.warn('[QRISInput] No image found in clipboard');
    },
    [scanFromImage]
  );

  const validationResult = validateQRIS(value);

  return (
    <div className="space-y-4">
      {/* Manual Input */}
      <div>
        <label className="mb-2 block text-sm font-medium text-gray-700">
          Paste QRIS String
        </label>
        <textarea
          value={value}
          onChange={handleTextChange}
          onPaste={handlePaste}
          placeholder="Paste QRIS string di sini..."
          rows={4}
          className="focus:border-kasirpintar-teal-500 w-full resize-none rounded-xl border-2 border-gray-200 px-4 py-3 font-mono text-sm transition-colors outline-none"
        />
      </div>

      {/* Drag & Drop Zone */}
      <div
        onDrop={handleDrop}
        onDragOver={handleDragOver}
        className="hover:border-kasirpintar-teal-500 cursor-pointer rounded-xl border-2 border-dashed border-gray-300 p-6 text-center transition-colors"
        onClick={() => fileInputRef.current?.click()}
      >
        <IconPhoto className="mx-auto mb-3 h-10 w-10 text-gray-400" />
        <p className="text-sm font-medium text-gray-600">
          Drag &amp; drop gambar QRIS atau klik untuk upload
        </p>
        <p className="mt-1 text-xs text-gray-400">Support: PNG, JPG, JPEG</p>
        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          onChange={handleFileSelect}
          className="hidden"
        />
      </div>

      {/* Camera Scan Button */}
      <div className="flex gap-3">
        {!isScanning ? (
          <button
            onClick={startCamera}
            type="button"
            className="flex flex-1 items-center justify-center gap-2 rounded-xl bg-gray-900 py-3 font-semibold text-white transition-colors hover:bg-gray-800"
          >
            <IconCamera className="h-5 w-5" />
            Scan dengan Kamera
          </button>
        ) : (
          <button
            onClick={stopCamera}
            type="button"
            className="flex-1 rounded-xl bg-red-600 py-3 font-semibold text-white transition-colors hover:bg-red-700"
          >
            Stop Camera
          </button>
        )}
        {onReset && (
          <button
            onClick={onReset}
            type="button"
            className="rounded-xl bg-gray-100 px-4 py-3 font-semibold text-gray-600 transition-colors hover:bg-gray-200"
          >
            Reset
          </button>
        )}
      </div>

      {/* Camera Preview */}
      {isScanning && (
        <div className="relative overflow-hidden rounded-xl bg-black">
          <video ref={videoRef} autoPlay playsInline muted className="w-full" />
          <div className="absolute inset-0 rounded-xl border-2 border-white/50">
            <div className="border-kasirpintar-teal-500 absolute top-1/2 left-1/2 h-48 w-48 -translate-x-1/2 -translate-y-1/2 border-2" />
          </div>
        </div>
      )}

      {/* Hidden Canvas for QR Scanning (always in DOM) */}
      <canvas ref={canvasRef} className="hidden" />

      {/* Scan Error */}
      {scanError && (
        <p className="text-center text-sm font-medium text-red-500">
          {scanError}
        </p>
      )}

      {/* Validation Errors */}
      {errors.length > 0 && (
        <div className="space-y-2">
          {errors.map((error, index) => (
            <div
              key={index}
              className="flex items-start gap-2 text-sm text-red-500"
            >
              <IconCircleX className="mt-0.5 h-5 w-5 flex-shrink-0" />
              <span>{error}</span>
            </div>
          ))}
        </div>
      )}

      {/* Validation Success */}
      {value && validationResult.valid && (
        <div className="text-kasirpintar-teal-600 flex items-center gap-2 text-sm font-medium">
          <IconCircleCheck className="h-5 w-5" />
          QRIS valid
        </div>
      )}
    </div>
  );
}
