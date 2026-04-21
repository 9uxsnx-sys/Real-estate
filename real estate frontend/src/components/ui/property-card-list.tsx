import * as React from 'react';
import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronLeft, ChevronRight, Bed, Bath, Maximize } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';

interface PropertyCardListProps {
  images: string[];
  price: string;
  title: string;
  location: string;
  beds: number;
  baths: number;
  space: number;
  propertyType: string;
  isNew?: boolean;
  className?: string;
  onClick?: () => void;
}

export const PropertyCardList = ({
  images,
  price,
  title,
  location,
  beds,
  baths,
  space,
  propertyType,
  isNew = false,
  className,
  onClick,
}: PropertyCardListProps) => {
  const { t } = useTranslation();
  const [currentIndex, setCurrentIndex] = useState(0);
  const [direction, setDirection] = useState(0);

  const changeImage = (newDirection: number, e: React.MouseEvent) => {
    e.stopPropagation();
    setDirection(newDirection);
    setCurrentIndex((prevIndex) => {
      const nextIndex = prevIndex + newDirection;
      if (nextIndex < 0) return images.length - 1;
      if (nextIndex >= images.length) return 0;
      return nextIndex;
    });
  };

  const carouselVariants = {
    enter: (direction: number) => ({
      x: direction > 0 ? '100%' : '-100%',
      opacity: 0,
    }),
    center: {
      zIndex: 1,
      x: 0,
      opacity: 1,
    },
    exit: (direction: number) => ({
      zIndex: 0,
      x: direction < 0 ? '100%' : '-100%',
      opacity: 0,
    }),
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.3 }}
      transition={{ duration: 0.4 }}
      whileHover={{ 
        scale: 1.01,
        boxShadow: '0px 4px 20px -4px rgba(0, 0, 0, 0.1)',
      }}
      onClick={onClick}
      className={cn(
        'w-full overflow-hidden rounded-2xl border border-[rgb(230,230,230)] bg-white cursor-pointer flex flex-col sm:flex-row',
        className
      )}
    >
      {/* Image Section - Left side */}
      <div className="relative group w-full sm:w-72 md:w-80 lg:w-96 flex-shrink-0 h-48 sm:h-auto sm:aspect-[4/3]">
        <AnimatePresence initial={false} custom={direction}>
          <motion.img
            key={currentIndex}
            src={images[currentIndex]}
            alt={title}
            custom={direction}
            variants={carouselVariants}
            initial="enter"
            animate="center"
            exit="exit"
            transition={{
              x: { type: 'spring', stiffness: 300, damping: 30 },
              opacity: { duration: 0.2 },
            }}
            className="absolute h-full w-full object-cover"
          />
        </AnimatePresence>
        
        {/* Carousel Navigation */}
        <div className="absolute inset-0 flex items-center justify-between p-2 opacity-0 group-hover:opacity-100 transition-opacity">
          <Button 
            variant="ghost" 
            size="icon" 
            className="rounded-full bg-black/30 hover:bg-black/50 text-white h-8 w-8" 
            onClick={(e) => changeImage(-1, e)}
          >
            <ChevronLeft className="h-4 w-4" />
          </Button>
          <Button 
            variant="ghost" 
            size="icon" 
            className="rounded-full bg-black/30 hover:bg-black/50 text-white h-8 w-8" 
            onClick={(e) => changeImage(1, e)}
          >
            <ChevronRight className="h-4 w-4" />
          </Button>
        </div>

        {/* Top Badges */}
        <div className="absolute top-3 left-3 flex gap-2">
          <Badge variant="secondary" className="bg-white/90 backdrop-blur-sm text-[10px]">
            {propertyType}
          </Badge>
          {isNew && (
            <Badge variant="secondary" className="bg-black text-white text-[10px]">
              New
            </Badge>
          )}
        </div>

        {/* Pagination Dots */}
        <div className="absolute bottom-3 left-1/2 -translate-x-1/2 flex gap-1.5">
          {images.map((_, index) => (
            <button
              key={index}
              onClick={(e) => {
                e.stopPropagation();
                setCurrentIndex(index);
              }}
              className={cn(
                'h-1.5 w-1.5 rounded-full transition-all',
                currentIndex === index ? 'w-4 bg-white' : 'bg-white/50'
              )}
              aria-label={`${t('gallery.goTo')} ${index + 1}`}
            />
          ))}
        </div>
      </div>

      {/* Content Section - Right side */}
      <div className="flex-1 p-4 sm:p-5 flex flex-col justify-between">
        <div>
          {/* Price - Prominent */}
          <h3 
            className="text-[20px] sm:text-[22px] font-semibold text-[rgb(44,44,44)] mb-2"
            style={{ fontFamily: 'Geist, sans-serif' }}
          >
            {price}
          </h3>

          {/* Title & Location */}
          <p 
            className="text-[16px] font-medium text-[rgb(44,44,44)] mb-1"
            style={{ fontFamily: 'Geist, sans-serif' }}
          >
            {title}
          </p>
          <p 
            className="text-[14px] text-[rgb(136,136,136)] font-light mb-4"
            style={{ fontFamily: 'Geist, sans-serif' }}
          >
            {location}
          </p>
        </div>

        {/* Specs - Bed, Bath, Space */}
        <div className="flex items-center gap-4 pt-3 border-t border-[rgb(230,230,230)]">
          <div className="flex items-center gap-1.5 text-[rgb(136,136,136)]">
            <Bed size={16} strokeWidth={1.5} />
            <span className="text-[13px]" style={{ fontFamily: 'Geist, sans-serif' }}>
              {beds} {t('property.beds')}
            </span>
          </div>
          <div className="flex items-center gap-1.5 text-[rgb(136,136,136)]">
            <Bath size={16} strokeWidth={1.5} />
            <span className="text-[13px]" style={{ fontFamily: 'Geist, sans-serif' }}>
              {baths} {t('property.baths')}
            </span>
          </div>
          <div className="flex items-center gap-1.5 text-[rgb(136,136,136)]">
            <Maximize size={16} strokeWidth={1.5} />
            <span className="text-[13px]" style={{ fontFamily: 'Geist, sans-serif' }}>
              {space} {t('property.sqft')}
            </span>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default PropertyCardList;
