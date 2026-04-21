import React from 'react';
import { useTranslation } from 'react-i18next';
import { Sparkles } from 'lucide-react';
import { PropertyFeature } from '../../types';

interface PropertyFeaturesProps {
  features?: PropertyFeature[];
}

export const PropertyFeatures: React.FC<PropertyFeaturesProps> = ({ features }) => {
  const { t } = useTranslation();
  // Default features if none provided
  const defaultFeatures: PropertyFeature[] = [
    { name: '1', feature_name: '6 Bedrooms & 4 Bathrooms', icon: 'sparkles' },
    { name: '2', feature_name: 'Bold Contemporary Design', icon: 'sparkles' },
    { name: '3', feature_name: 'Professionally Landscaped Garden', icon: 'sparkles' },
    { name: '4', feature_name: 'Spacious Driveway & Garage', icon: 'sparkles' },
    { name: '5', feature_name: 'Investment-Ready Property', icon: 'sparkles' },
  ];

  const displayFeatures = features?.length ? features : defaultFeatures;

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
              {feature.feature_name}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
};
