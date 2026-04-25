import React from 'react';
import { useTranslation } from 'react-i18next';
import { Sparkles } from 'lucide-react';
import { PropertyFeature } from '../../types';

interface PropertyFeaturesProps {
  features?: PropertyFeature[];
}

export const PropertyFeatures: React.FC<PropertyFeaturesProps> = ({ features }) => {
  const { t } = useTranslation();

  const displayFeatures = features?.length ? features : [];

  return (
    <div className="py-6 border-b border-[rgb(230,230,230)]">
      <h3 
        className="text-[20px] md:text-[24px] font-semibold text-[rgb(44,44,44)] mb-4"
        style={{ fontFamily: 'Geist, sans-serif' }}
      >
        {t('property.features')}
      </h3>
      <div className="flex flex-col gap-4">
        {displayFeatures.map((feature, index) => (
          <div key={index} className="flex items-center gap-3">
            <Sparkles 
              size={20} 
              strokeWidth={1.5}
              className="text-[rgb(136,136,136)]" 
            />
            <span 
              className="text-[14px] md:text-[16px] text-[rgb(44,44,44)] font-light"
              style={{ fontFamily: 'Geist, sans-serif' }}
            >
              {feature.name}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
};
