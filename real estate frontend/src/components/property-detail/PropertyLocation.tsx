import React from 'react';
import { useTranslation } from 'react-i18next';

interface PropertyLocationProps {
  address?: string;
  lat?: number;
  lng?: number;
}

export const PropertyLocation: React.FC<PropertyLocationProps> = ({ 
  address = "Bel Air, Los Angeles, CA",
  lat = 34.100222,
  lng = -118.450709 
}) => {
  const { t } = useTranslation();
  // Google Maps embed URL
  const mapUrl = `https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3305.715220363292!2d${lng}!3d${lat}!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x0%3A0x0!2zMzTCsDA2JzAwLjgiTiAxMTjCsDI3JzAyLjYiVw!5e0!3m2!1sen!2sus!4v1`;

  return (
    <div className="py-6">
      <h3 
        className="text-[20px] md:text-[24px] font-semibold text-[rgb(44,44,44)] mb-4"
        style={{ fontFamily: 'Geist, sans-serif' }}
      >
        {t('property.location')}
      </h3>
      <div className="relative w-full h-[300px] md:h-[400px] rounded-3xl overflow-hidden">
        <iframe
          src={mapUrl}
          width="100%"
          height="100%"
          style={{ border: 0 }}
          allowFullScreen
          loading="lazy"
          referrerPolicy="no-referrer-when-downgrade"
          className="rounded-3xl"
        />
      </div>
      <p 
        className="mt-3 text-[14px] md:text-[16px] text-[rgb(136,136,136)] font-light"
        style={{ fontFamily: 'Geist, sans-serif' }}
      >
        {address}
      </p>
    </div>
  );
};
