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
import { useProperty } from '../hooks';
import { formatPrice, getImageUrl } from '../utils';
import type { PropertyFeature as PropertyFeatureType } from '../types';

export const PropertyDetail: React.FC = () => {
  const navigate = useNavigate();
  const { id, lang } = useParams<{ id: string; lang: string }>();
  const { t, i18n } = useTranslation();
  const currentLang = lang || 'en';

  const pageRef = useRef<HTMLDivElement>(null);
  const backBtnRef = useRef<HTMLButtonElement>(null);
  const titleRef = useRef<HTMLHeadingElement>(null);
  const priceRef = useRef<HTMLHeadingElement>(null);

  const { property, loading, error } = useProperty(id, currentLang);

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

  if (loading) {
    return (
      <div className="min-h-screen bg-white">
        <Navigation />
        <div className="max-w-[1360px] mx-auto px-4 md:px-8 lg:px-20 py-12">
          <div className="animate-pulse">
            <div className="h-8 w-32 bg-gray-200 rounded mb-6"></div>
            <div className="aspect-[16/9] bg-gray-200 rounded-3xl mb-6"></div>
            <div className="h-12 w-64 bg-gray-200 rounded mb-4"></div>
            <div className="h-6 w-48 bg-gray-200 rounded"></div>
          </div>
        </div>
      </div>
    );
  }

  if (error || !property) {
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

  const galleryImages = property.image ? [getImageUrl(property.image)] : [];

  const features: PropertyFeatureType[] = [
    { id: '1', name: `${property.beds} Bedrooms & ${property.baths} Bathrooms` },
    { id: '2', name: `${property.space_sqm} m² Living Space` },
    { id: '3', name: 'Modern Architecture' },
    { id: '4', name: 'Prime Location' },
    { id: '5', name: 'Investment-Ready Property' },
  ];

  return (
    <div ref={pageRef} className="min-h-screen bg-white">
      <Navigation />
      <div className="max-w-[1360px] mx-auto px-4 md:px-8 lg:px-20 py-6">
        <button
          ref={backBtnRef}
          onClick={() => navigate(`/${currentLang}`)}
          className="flex items-center gap-2 text-[14px] text-[rgb(136,136,136)] hover:text-[rgb(44,44,44)] transition-colors mb-6"
          style={{ fontFamily: 'Geist, sans-serif' }}
        >
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            {i18n.language === 'ar' ? (
              <path d="M5 12h14M12 19l7-7-7-7" />
            ) : (
              <path d="M19 12H5M12 19l-7-7 7-7" />
            )}
          </svg>
          {t('property.backToProperties')}
        </button>

        <PropertyGallery
          images={galleryImages}
          propertyName={property.name}
        />

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
              {property.project ? `${property.project.name}, ${property.area}` : `${property.area}, ${property.city}`}
            </span>
          </div>
        </div>

        <PropertySpecs property={property} />

        <div className="grid grid-cols-1 lg:grid-cols-[1fr_300px] xl:grid-cols-[1fr_340px] gap-8 lg:gap-12 mt-6">
          <div className="order-1">
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
                {property.description || `Introducing ${property.name}, a stunning ${property.beds}-bedroom residence featuring ${property.space_sqm} m² of modern living space. Located in the prestigious area of ${property.area}, this property offers exceptional value and comfort.`}
              </p>
            </div>

            <PropertyFeatures features={features} />

            <PropertyLocation
              address={`${property.area}, ${property.city}`}
              lat={25.2048}
              lng={55.2708}
            />
          </div>

          <div className="order-2">
            <PropertyContactSidebar
              property={property}
              propertyCode={property.property_code}
              whatsappNumber="+971501234567"
            />
          </div>
        </div>
      </div>
    </div>
  );
};