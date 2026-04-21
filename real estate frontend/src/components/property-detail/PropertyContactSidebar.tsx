import React from 'react';
import { useTranslation } from 'react-i18next';
import { MessageCircle, Phone } from 'lucide-react';
import { Property } from '../../types';

interface PropertyContactSidebarProps {
  property: Property;
  propertyCode?: string;
  whatsappNumber?: string;
}

export const PropertyContactSidebar: React.FC<PropertyContactSidebarProps> = ({ 
  property, 
  propertyCode,
  whatsappNumber = "1234567890"
}) => {
  const { t } = useTranslation();
  const phoneNumber = "+971 4 123 4567";
  const whatsappLink = `https://wa.me/${whatsappNumber}?text=I'm interested in property ${propertyCode || property.id}`;
  const telLink = `tel:${phoneNumber.replace(/\s/g, '')}`;

  return (
    <div className="border border-[rgb(230,230,230)] rounded-3xl p-6 bg-white sticky top-24">
      {/* REF Code */}
      {propertyCode && (
        <div className="mb-4">
          <div className="flex items-center justify-between mb-3">
            <span 
              className="text-[16px] font-medium text-[rgb(44,44,44)]"
              style={{ fontFamily: 'Geist, sans-serif' }}
            >
              {t('property.propertyCode')}
            </span>
            <span 
              className="text-[16px] font-medium text-[rgb(44,44,44)] tracking-wide"
              style={{ fontFamily: 'Geist, sans-serif' }}
            >
              {propertyCode}
            </span>
          </div>
          <div className="h-px bg-[rgb(230,230,230)] mb-3" />
          <p 
            className="text-[12px] text-[rgb(136,136,136)] font-normal leading-relaxed"
            style={{ fontFamily: 'Geist, sans-serif' }}
          >
            {t('property.propertyCodeDesc')}
          </p>
        </div>
      )}

      {/* Contact Section */}
      <div className="mb-4">
        <p 
          className="text-[11px] text-[rgb(136,136,136)] font-normal uppercase tracking-wider mb-3"
          style={{ fontFamily: 'Geist, sans-serif' }}
        >
          {t('sidebar.getInTouch')}
        </p>
        <p 
          className="text-[13px] text-[rgb(44,44,44)] font-normal mb-4"
          style={{ fontFamily: 'Geist, sans-serif' }}
        >
          {t('sidebar.contactDesc')}
        </p>
      </div>

      {/* Contact Buttons */}
      <div className="space-y-3">
        {/* WhatsApp Button */}
        <a
          href={whatsappLink}
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center justify-center gap-2 bg-black text-white rounded-full py-3.5 px-4 text-[14px] font-normal hover:bg-[rgb(44,44,44)] transition-colors w-full"
          style={{ fontFamily: 'Geist, sans-serif' }}
        >
          <MessageCircle size={18} strokeWidth={1.5} />
          {t('property.whatsapp')}
        </a>

        {/* Phone Button */}
        <a
          href={telLink}
          className="flex items-center justify-center gap-2 border border-[rgb(230,230,230)] text-[rgb(44,44,44)] rounded-full py-3.5 px-4 text-[14px] font-normal hover:bg-[rgb(250,250,250)] transition-colors w-full"
          style={{ fontFamily: 'Geist, sans-serif' }}
        >
          <Phone size={18} strokeWidth={1.5} />
          {phoneNumber}
        </a>
      </div>
    </div>
  );
};
