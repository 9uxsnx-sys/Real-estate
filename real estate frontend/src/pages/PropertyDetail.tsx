import React, { useEffect, useRef } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import gsap from 'gsap';
import { Navigation } from '../components/layout';
import {
  PropertyGallery,
  PropertySpecs,
  PropertyFeatures,
  PropertyLocation,
  PropertyContactSidebar
} from '../components/property-detail';
import { properties } from '../data/properties';
import { PropertyDetail as PropertyDetailType } from '../types';
import { formatPrice } from '../utils';

// Extended property data with detail fields
const getPropertyWithDetails = (id: string): PropertyDetailType | null => {
  const property = properties.find((p) => p.id === id);
  if (!property) return null;

  return {
    ...property,
    description: `Introducing ${property.name}, a striking ${property.beds}-bedroom residence designed for both luxury living and smart investment. Located in the prestigious neighborhood of ${property.location}, this ${property.spaceSqm} m² home features bold modern architecture, open-plan interiors, and refined finishes. With ${property.baths} bathrooms, spacious living areas, and curated landscaping, it's a statement of comfort, style, and long-term value.`,
    features: [
      { name: '1', feature_name: `${property.beds} Bedrooms & ${property.baths} Bathrooms`, icon: 'home' },
      { name: '2', feature_name: 'Bold Contemporary Design', icon: 'home' },
      { name: '3', feature_name: 'Professionally Landscaped Garden', icon: 'tree' },
      { name: '4', feature_name: 'Spacious Driveway & Garage', icon: 'car' },
      { name: '5', feature_name: 'Investment-Ready Property', icon: 'trending-up' },
    ],
    gallery: [
      property.image,
      property.image,
      property.image,
      property.image,
      property.image,
    ],
    propertyCode: `VH-${property.id.toUpperCase().padStart(3, '0')}`,
    whatsappNumber: '1234567890',
    map_location: {
      lat: 34.100222,
      lng: -118.450709,
      address: property.location,
    },
  };
};

export const PropertyDetail: React.FC = () => {
  const navigate = useNavigate();
  const { id, lang } = useParams<{ id: string; lang: string }>();
  const { t, i18n } = useTranslation();
  const currentLang = lang || 'en';
  const isRTL = i18n.language === 'ar';

  const pageRef = useRef<HTMLDivElement>(null);
  const backBtnRef = useRef<HTMLButtonElement>(null);
  const titleRef = useRef<HTMLHeadingElement>(null);
  const priceRef = useRef<HTMLHeadingElement>(null);
  
  const property = id ? getPropertyWithDetails(id) : null;

  useEffect(() => {
    if (!pageRef.current) return;
    
    const ctx = gsap.context(() => {
      const tl = gsap.timeline();
      
      if (backBtnRef.current) {
        tl.fromTo(backBtnRef.current,
          { opacity: 0, x: -20 },
          { opacity: 1, x: 0, duration: 0.5, ease: 'power3.out' }
        );
      }
      
      if (titleRef.current) {
        tl.fromTo(titleRef.current,
          { opacity: 0, y: 30, scale: 0.95 },
          { opacity: 1, y: 0, scale: 1, duration: 0.7, ease: 'power3.out' },
          '-=0.3'
        );
      }
      
      if (priceRef.current) {
        tl.fromTo(priceRef.current,
          { opacity: 0, y: 20 },
          { opacity: 1, y: 0, duration: 0.5, ease: 'power3.out' },
          '-=0.4'
        );
      }
      
      // Animate sections
      const sections = pageRef.current.querySelectorAll('section, .border-b');
      gsap.fromTo(sections,
        { opacity: 0, y: 40 },
        {
          opacity: 1,
          y: 0,
          duration: 0.7,
          stagger: 0.15,
          ease: 'power3.out',
          scrollTrigger: {
            trigger: pageRef.current,
            start: 'top 80%'
          }
        }
      );
    }, pageRef);
    
    return () => ctx.revert();
  }, [property]);

  if (!property) {
    return (
      <div className="min-h-screen bg-white">
        <Navigation />
        <div className="max-w-[1360px] mx-auto px-4 md:px-8 lg:px-20 py-12 text-center">
          <h1
            className="text-2xl font-semibold text-[rgb(44,44,44)] mb-4"
            style={{ fontFamily: 'Geist, sans-serif' }}
          >
            {t('common.notFound')}
          </h1>
          <p
            className="text-[rgb(136,136,136)] mb-6"
            style={{ fontFamily: 'Geist, sans-serif' }}
          >
            The property you're looking for doesn't exist.
          </p>
          <button
            onClick={() => navigate(`/${currentLang}`)}
            className="px-6 py-3 bg-black text-white rounded-full"
            style={{ fontFamily: 'Geist, sans-serif' }}
          >
            {t('property.backToProperties')}
          </button>
        </div>
      </div>
    );
  }

  return (
    <div ref={pageRef} className="min-h-screen bg-white">
      <Navigation />
      <div className="max-w-[1360px] mx-auto px-4 md:px-8 lg:px-20 py-6">
        {/* Back Button */}
        <button
          ref={backBtnRef}
          onClick={() => navigate(`/${currentLang}`)}
          className="flex items-center gap-2 text-[14px] text-[rgb(136,136,136)] hover:text-[rgb(44,44,44)] transition-colors mb-6"
          style={{ fontFamily: 'Geist, sans-serif' }}
        >
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            {isRTL ? (
              <path d="M5 12h14M12 19l7-7-7-7" />
            ) : (
              <path d="M19 12H5M12 19l-7-7 7-7" />
            )}
          </svg>
          {t('property.backToProperties')}
        </button>

        {/* Gallery - Full Width */}
        <PropertyGallery
          images={property.gallery || [property.image]}
          propertyName={property.name}
        />

        {/* Price & Location */}
        <div className="mt-6 mb-4">
          <h1
            ref={priceRef}
            className="text-[28px] md:text-[36px] lg:text-[40px] font-semibold text-[rgb(44,44,44)]"
            style={{ fontFamily: 'Geist, sans-serif' }}
          >
            {formatPrice(property.price)}
          </h1>
          <div className="flex items-center gap-2 mt-2">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="rgb(136,136,136)" strokeWidth="2">
              <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0118 0z" />
              <circle cx="12" cy="10" r="3" />
            </svg>
            <span
              className="text-[14px] md:text-[16px] text-[rgb(136,136,136)] font-light"
              style={{ fontFamily: 'Geist, sans-serif' }}
            >
              {property.projectName}, {property.location}
            </span>
          </div>
        </div>

        {/* Specs */}
        <PropertySpecs property={property} />

        {/* Two Column Section: Content Left, Sidebar Right */}
        <div className="grid grid-cols-1 lg:grid-cols-[1fr_300px] xl:grid-cols-[1fr_340px] gap-8 lg:gap-12 mt-6">
          {/* Content - Left */}
          <div className="order-1">
            {/* Description */}
            <div className="py-6 border-b border-[rgb(230,230,230)]">
              <h3
                className="text-[20px] md:text-[24px] font-semibold text-[rgb(44,44,44)] mb-4"
                style={{ fontFamily: 'Geist, sans-serif' }}
              >
                {t('property.overview')}
              </h3>
              <p
                className="text-[14px] md:text-[16px] text-[rgb(44,44,44)] font-light leading-relaxed"
                style={{ fontFamily: 'Geist, sans-serif' }}
              >
                {property.description}
              </p>
            </div>

            {/* Features */}
            <PropertyFeatures features={property.features} />

            {/* Location */}
            <PropertyLocation
              address={property.map_location?.address}
              lat={property.map_location?.lat}
              lng={property.map_location?.lng}
            />
          </div>

          {/* Sidebar - Right */}
          <div className="order-2">
            <PropertyContactSidebar
              property={property}
              propertyCode={property.propertyCode}
              whatsappNumber={property.whatsappNumber}
            />
          </div>
        </div>
      </div>
    </div>
  );
};
