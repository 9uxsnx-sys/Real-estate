import type { Property } from '../types';

export const formatPrice = (price: number): string => {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    maximumFractionDigits: 0,
  }).format(price);
};

export const getPropertyTypeLabel = (type: Property['propertyType']): string => {
  const labels: Record<string, string> = {
    studio: 'Studio',
    f1: 'F1',
    f2: 'F2',
    f3: 'F3',
    f4: 'F4',
    'f5+': 'F5+',
    garage: 'Garage',
  };
  return labels[type] || type;
};
