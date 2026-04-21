import React from 'react';
import { useTranslation } from 'react-i18next';
import { Property } from '../../types';
import { formatPrice, getPropertyTypeLabel } from '../../utils';

interface PropertyCardProps {
  property: Property;
  onClick?: (id: string) => void;
  viewMode?: 'grid' | 'list';
}

export const PropertyCard: React.FC<PropertyCardProps> = ({ property, onClick, viewMode = 'grid' }) => {
  const { t } = useTranslation();
  const handleClick = () => {
    if (onClick) {
      onClick(property.id);
    }
  };

  // Grid View (Vertical Card)
  if (viewMode === 'grid') {
    return (
      <div
        onClick={handleClick}
        className="group cursor-pointer bg-white rounded-4xl overflow-hidden transition-all duration-300 hover:-translate-y-1 hover:shadow-lg h-full flex flex-col"
        style={{ boxShadow: '0 4px 12px rgba(0,0,0,0.1)' }}
      >
        {/* Image Container - NO TAGS */}
        <div className="relative aspect-[4/3] overflow-hidden rounded-t-4xl flex-shrink-0">
          <img
            src={property.image}
            alt={property.name}
            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
          />
        </div>

        {/* Content */}
        <div className="p-5 flex flex-col flex-grow">
          {/* Property Name */}
          <h3
            className="font-semibold text-[20px] text-[rgb(44,44,44)] mb-2 line-clamp-1"
            style={{ fontFamily: 'Geist, sans-serif' }}
          >
            {property.name}
          </h3>

          {/* Project Name */}
          <p
            className="text-[14px] text-[rgb(136,136,136)] font-light mb-2 line-clamp-1"
            style={{ fontFamily: 'Geist, sans-serif' }}
          >
            {property.projectName}
          </p>

          {/* Location */}
          <div className="flex items-center gap-1 mb-3">
            <svg
              width="16"
              height="16"
              viewBox="0 0 24 24"
              fill="none"
              stroke="rgb(44,44,44)"
              strokeWidth="2"
              className="flex-shrink-0"
            >
              <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0118 0z" />
              <circle cx="12" cy="10" r="3" />
            </svg>
            <span
              className="text-[14px] text-[rgb(44,44,44)] font-light line-clamp-1"
              style={{ fontFamily: 'Geist, sans-serif' }}
            >
              {property.location}
            </span>
          </div>

          {/* Specs */}
          <div className="flex items-center gap-3 text-[rgb(136,136,136)] text-[14px] mb-4">
            <span className="font-light" style={{ fontFamily: 'Geist, sans-serif' }}>
              {getPropertyTypeLabel(property.propertyType)}
            </span>
            <span className="text-[rgb(199,199,199)]">•</span>
            <span className="font-light" style={{ fontFamily: 'Geist, sans-serif' }}>
              {property.spaceSqm} {t('property.sqft')}
            </span>
            <span className="text-[rgb(199,199,199)]">•</span>
            <span className="font-light" style={{ fontFamily: 'Geist, sans-serif' }}>
              {property.beds} {t('property.beds')}
            </span>
            <span className="text-[rgb(199,199,199)]">•</span>
            <span className="font-light" style={{ fontFamily: 'Geist, sans-serif' }}>
              {property.baths} {t('property.baths')}
            </span>
          </div>

          {/* Price and Button Row - Push to bottom */}
          <div className="flex items-center justify-between mt-auto">
            <span
              className="font-semibold text-[18px] text-[rgb(44,44,44)]"
              style={{ fontFamily: 'Geist, sans-serif' }}
            >
              {formatPrice(property.price)}
            </span>
            
            {/* View Details Button - appears on hover */}
            <span
              className="opacity-0 group-hover:opacity-100 transition-opacity duration-300 text-[14px] font-light text-[rgb(136,136,136)]"
              style={{ fontFamily: 'Geist, sans-serif' }}
            >
              View Details →
            </span>
          </div>
        </div>
      </div>
    );
  }

  // List View (Horizontal Card)
  return (
    <div
      onClick={handleClick}
      className="group cursor-pointer bg-white rounded-3xl overflow-hidden transition-all duration-300 hover:shadow-lg flex flex-row h-[160px] sm:h-[150px] md:h-[170px]"
      style={{ boxShadow: '0 4px 12px rgba(0,0,0,0.1)' }}
    >
      {/* Image - 40% on mobile, 35% on larger */}
      <div className="relative w-[40%] sm:w-[35%] h-full overflow-hidden flex-shrink-0">
        <img
          src={property.image}
          alt={property.name}
          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105 rounded-l-3xl"
        />
      </div>

      {/* MOBILE LAYOUT - Clean single column */}
      <div className="flex sm:hidden flex-col justify-between p-3 flex-1 min-w-0">
        {/* Header: Title + Project */}
        <div className="min-w-0">
          <h3 className="font-semibold text-[15px] text-[rgb(44,44,44)] leading-tight truncate" style={{ fontFamily: 'Geist, sans-serif' }}>
            {property.name}
          </h3>
          <p className="text-[12px] text-[rgb(136,136,136)] font-light mt-0.5 truncate" style={{ fontFamily: 'Geist, sans-serif' }}>
            {property.projectName}
          </p>
        </div>

        {/* Specs: Inline with dots */}
        <div className="flex items-center gap-1.5 text-[rgb(102,102,102)] text-[12px] overflow-hidden">
          <span className="font-light whitespace-nowrap bg-[rgb(245,245,245)] px-2 py-0.5 rounded-full" style={{ fontFamily: 'Geist, sans-serif' }}>
            {getPropertyTypeLabel(property.propertyType)}
          </span>
          <span className="text-[rgb(199,199,199)]">•</span>
          <span className="font-light whitespace-nowrap" style={{ fontFamily: 'Geist, sans-serif' }}>
            {property.spaceSqm}m²
          </span>
          <span className="text-[rgb(199,199,199)]">•</span>
          <span className="font-light whitespace-nowrap" style={{ fontFamily: 'Geist, sans-serif' }}>
            {property.beds}bd
          </span>
        </div>

        {/* Price */}
        <div className="flex items-center justify-between">
          <span className="font-semibold text-[16px] text-[rgb(44,44,44)]" style={{ fontFamily: 'Geist, sans-serif' }}>
            {formatPrice(property.price)}
          </span>
        </div>
      </div>

      {/* TABLET & DESKTOP LAYOUT */}
      <div className="hidden sm:flex flex-1 flex-col p-3 md:p-4 min-w-0 justify-between">
        <div className="min-w-0">
          <h3 className="font-semibold text-[15px] lg:text-[17px] text-[rgb(44,44,44)] leading-snug truncate" style={{ fontFamily: 'Geist, sans-serif' }}>
            {property.name}
          </h3>
          <p className="text-[12px] lg:text-[13px] text-[rgb(136,136,136)] font-light mt-0.5 truncate" style={{ fontFamily: 'Geist, sans-serif' }}>
            {property.projectName}
          </p>
          <div className="flex items-center gap-2 text-[rgb(136,136,136)] text-[12px] lg:text-[13px] mt-1.5">
            <span className="font-light whitespace-nowrap bg-[rgb(243,243,243)] px-2 py-0.5 rounded" style={{ fontFamily: 'Geist, sans-serif' }}>
              {getPropertyTypeLabel(property.propertyType)}
            </span>
            <span className="text-[rgb(199,199,199)]">•</span>
            <span className="font-light whitespace-nowrap" style={{ fontFamily: 'Geist, sans-serif' }}>
              {property.spaceSqm}m²
            </span>
            <span className="text-[rgb(199,199,199)]">•</span>
            <span className="font-light whitespace-nowrap" style={{ fontFamily: 'Geist, sans-serif' }}>
              {property.beds}bd
            </span>
          </div>
        </div>

        <div className="flex items-end justify-between mt-1">
          <span className="font-semibold text-[16px] lg:text-[18px] text-[rgb(44,44,44)] truncate" style={{ fontFamily: 'Geist, sans-serif' }}>
            {formatPrice(property.price)}
          </span>
        </div>
      </div>
    </div>
  );
};
