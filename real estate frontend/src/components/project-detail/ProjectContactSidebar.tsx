import React from 'react';
import { useTranslation } from 'react-i18next';
import { MessageCircle, Phone } from 'lucide-react';
import { Property } from '../../types';

interface ProjectContactSidebarProps {
  property: Property;
  whatsappNumber?: string;
}

export const ProjectContactSidebar: React.FC<ProjectContactSidebarProps> = ({ 
  property, 
  whatsappNumber = "1234567890"
}) => {
  const { t } = useTranslation();
  const phoneNumber = "+971 4 123 4567";
  const whatsappLink = `https://wa.me/${whatsappNumber}?text=I'm interested in ${property.projectName}`;
  const telLink = `tel:${phoneNumber.replace(/\s/g, '')}`;

  return (
    <div className="border border-[rgb(230,230,230)] rounded-3xl p-6 bg-white sticky top-24">
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

export default ProjectContactSidebar;
