import * as React from 'react';
import { useTranslation } from 'react-i18next';
import { motion } from 'framer-motion';
import { ArrowUpRight, ArrowUpLeft } from 'lucide-react';

interface InfoCardComponentProps {
  image: string;
  title: string;
  description: string;
  onExplore: () => void;
  projectNumber?: string;
}

export const InfoCardComponent = ({
  image,
  title,
  description,
  onExplore,
  projectNumber,
}: InfoCardComponentProps) => {
  const { t, i18n } = useTranslation();
  const isRTL = i18n.language === 'ar';
  return (
    <motion.div
      initial={{ opacity: 0, x: 20 }}
      whileInView={{ opacity: 1, x: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.8, ease: [0.25, 0.1, 0.25, 1], delay: 0.1 }}
      className="lg:col-span-4 flex flex-col gap-6"
    >
      {/* Small Image */}
      <div className="relative w-full h-[200px] sm:h-[240px] lg:h-[260px] rounded-[24px] overflow-hidden group shrink-0">
        <img
          src={image}
          alt={title}
          className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-105"
        />
        {/* Glass Edge Overlay */}
        <div className="absolute inset-0 pointer-events-none border-[rgba(255,255,255,0.25)] border-[1.5px] rounded-[24px] z-20 shadow-[inset_0_0_20px_rgba(255,255,255,0.08)]" />
      </div>

      {/* Text Content */}
      <div className="flex flex-col justify-center gap-3">
        <h3
          className="text-[22px] sm:text-[26px] lg:text-[28px] font-semibold text-[rgb(44,44,44)] leading-[1.2] tracking-tight"
          style={{ fontFamily: 'Geist, sans-serif' }}
        >
          {title}
        </h3>
        <p
          className="text-[rgb(100,100,100)] leading-[1.6] text-[14px] sm:text-[15px] font-light"
          style={{ fontFamily: 'Geist, sans-serif' }}
        >
          {description}
        </p>
        <motion.button
          onClick={onExplore}
          whileHover={{ x: isRTL ? -4 : 4 }}
          className="inline-flex items-center gap-2 text-[rgb(44,44,44)] font-medium text-[14px] hover:opacity-70 transition-opacity group/link mt-2"
          style={{ fontFamily: 'Geist, sans-serif' }}
        >
          {t('property.seeDetails')}
          {isRTL ? (
            <ArrowUpLeft className="w-4 h-4 transition-transform duration-300 group-hover/link:-translate-x-1 group-hover/link:-translate-y-1" />
          ) : (
            <ArrowUpRight className="w-4 h-4 transition-transform duration-300 group-hover/link:translate-x-1 group-hover/link:-translate-y-1" />
          )}
        </motion.button>
      </div>
    </motion.div>
  );
};

export default InfoCardComponent;
