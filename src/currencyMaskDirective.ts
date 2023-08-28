import type { Directive } from 'vue';

const formatCurrency = (value: string) => {
  if (!value) return '';

  // Remove non-numeric characters
  const numericValue = value.replace(/\D/g, '');

  // Convert to number and format as currency
  const formatter = new Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency: 'BRL',
    minimumFractionDigits: 2,
  });

  return formatter.format(Number(numericValue) / 100);
};

export const currencyMaskDirective: Directive = {
  updated(el) {
    el.value = formatCurrency(el.value);
  },
};
