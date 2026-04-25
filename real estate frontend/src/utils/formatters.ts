import type { Property } from '../types';

export const formatPrice = (price: number): string => {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    maximumFractionDigits: 0,
  }).format(price);
};

export const getPropertyTypeLabel = (type: Property['property_type']): string => {
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

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:1337';

export const getImageUrl = (imagePath: string | null | undefined): string => {
  if (!imagePath) {
    return 'https://proxy.extractcss.dev/https://framerusercontent.com/images/rfYNgbnQgBOihPRT6UaLPi82u0.jpg?scale-down-to=1024';
  }

  if (imagePath.startsWith('http://') || imagePath.startsWith('https://')) {
    return imagePath;
  }

  if (imagePath.startsWith('/uploads/')) {
    return `${API_URL}${imagePath}`;
  }

  if (imagePath.startsWith('/assets/')) {
    return imagePath;
  }

  return `${API_URL}/uploads/${imagePath}`;
};
