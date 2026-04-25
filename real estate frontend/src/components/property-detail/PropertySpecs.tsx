import React from 'react';
import { useTranslation } from 'react-i18next';
import { Home, Bed, Bath, Square } from 'lucide-react';
import { Property } from '../../types';
import { getPropertyTypeLabel } from '../../utils';

interface PropertySpecsProps {
  property: Property;
}

export const PropertySpecs: React.FC<PropertySpecsProps> = ({ property }) => {
  const { t } = useTranslation();
  const specs = [
    { icon: Home, label: getPropertyTypeLabel(property.property_type) },
    { icon: Bed, label: `${property.beds} ${t('property.beds')}` },
    { icon: Bath, label: `${property.baths} ${t('property.baths')}` },
    { icon: Square, label: `${property.space_sqm} m²` },
  ];

  return (
    <div className="flex flex-wrap items-center gap-6 md:gap-8 py-6 border-b border-[rgb(230,230,230)]">
      {specs.map((spec, index) => (
        <div key={index} className="flex items-center gap-2">
          <spec.icon 
            size={20} 
            strokeWidth={1.5}
            className="text-[rgb(136,136,136)]" 
          />
          <span 
            className="text-[16px] md:text-[18px] text-[rgb(44,44,44)] font-light"
            style={{ fontFamily: 'Geist, sans-serif' }}
          >
            {spec.label}
          </span>
        </div>
      ))}
    </div>
  );
};
