import { formatRupiah } from '@/lib/utils';

interface AmountDisplayProps {
  amount: number;
  label?: string;
}

export function AmountDisplay({
  amount,
  label = 'Jumlah',
}: AmountDisplayProps) {
  return (
    <div className="py-6 text-center">
      {label && label !== '' && (
        <p className="mb-2 text-sm font-medium text-gray-500">{label}</p>
      )}
      <p className="font-display text-5xl font-bold tracking-tight md:text-6xl">
        {formatRupiah(amount)}
      </p>
    </div>
  );
}
