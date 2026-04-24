export const formatRupiah = (amount: number): string => {
  return new Intl.NumberFormat('id-ID', {
    style: 'currency',
    currency: 'IDR',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(amount);
};

export const parseAmountInput = (value: string): string => {
  // Remove non-numeric characters except for leading zeros handling
  const numeric = value.replace(/[^0-9]/g, '');
  // Remove leading zeros
  return numeric.replace(/^0+/, '') || '';
};
