import React, { useEffect, useRef } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import gsap from 'gsap';
import {
  PropertyGallery,
  PropertySpecs,
  PropertyFeatures,
  PropertyLocation,
} from '../components/property-detail';
import { ProjectSection, ProjectSectionData, ProjectContactSidebar } from '../components/project-detail';
import { PropertyCard } from '@/components/ui/property-card';
import { properties } from '../data/properties';
import { PropertyDetail as PropertyDetailType } from '../types';
import { formatPrice } from '../utils';

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

export const ProjectDetail: React.FC = () => {
  const navigate = useNavigate();
  const { projectId, lang } = useParams<{ projectId: string; lang: string }>();
  const { t, i18n } = useTranslation();
  const currentLang = lang || 'en';
  const isRTL = i18n.language === 'ar';

  const pageRef = useRef<HTMLDivElement>(null);
  const backBtnRef = useRef<HTMLButtonElement>(null);
  const titleRef = useRef<HTMLHeadingElement>(null);

  const projectProperties = properties.filter(
    (p) => p.projectName.toLowerCase().replace(/\s+/g, '-') === projectId
  );

  const property = projectProperties.length > 0
    ? getPropertyWithDetails(projectProperties[0].id)
    : null;

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
      
      // Animate sections with stagger
      const sections = pageRef.current.querySelectorAll('.border-b, .project-section');
      gsap.fromTo(sections,
        { opacity: 0, y: 40 },
        {
          opacity: 1,
          y: 0,
          duration: 0.7,
          stagger: 0.12,
          ease: 'power3.out',
          scrollTrigger: {
            trigger: pageRef.current,
            start: 'top 80%'
          }
        }
      );
      
      // Animate property cards
      const cards = pageRef.current.querySelectorAll('.property-card');
      gsap.fromTo(cards,
        { opacity: 0, y: 40, scale: 0.95 },
        {
          opacity: 1,
          y: 0,
          scale: 1,
          duration: 0.6,
          stagger: 0.1,
          ease: 'power3.out',
          scrollTrigger: {
            trigger: cards[0],
            start: 'top 85%'
          }
        }
      );
    }, pageRef);
    
    return () => ctx.revert();
  }, [property]);

  if (!property) {
    return (
      <div className="min-h-screen bg-white">
        <div className="max-w-[1360px] mx-auto px-4 md:px-8 lg:px-20 py-12 text-center">
          <h1
            className="text-2xl font-semibold text-[rgb(44,44,44)] mb-4"
            style={{ fontFamily: 'Geist, sans-serif' }}
          >
            {t('common.notFound')}
          </h1>
          <button
            onClick={() => navigate(`/${currentLang}/projects`)}
            className="px-6 py-3 bg-black text-white rounded-full hover:bg-[rgb(44,44,44)] transition-colors"
          >
            {t('project.backToProjects')}
          </button>
        </div>
      </div>
    );
  }

  const projectImages = [property.image, property.image, property.image, property.image];

  const customSections: ProjectSectionData[] = [
    {
      id: 'studio',
      title: 'Studio Units',
      images: projectImages.slice(0, 4),
      description: 'Our studio apartments feature open floor plans with floor-to-ceiling windows, modern kitchenettes, and stunning city views. Perfect for young professionals or as investment properties.',
      features: [
        'Open floor plan design',
        'Floor-to-ceiling windows',
        'Modern kitchenette',
        'City skyline views',
        'Smart home integration',
      ],
    },
    {
      id: 'f1',
      title: 'First Floor - F1',
      images: projectImages.slice(0, 4),
      description: 'The ground floor features an elegant grand lobby with 24/7 concierge service, package room, and direct access to all building amenities.',
      features: [
        'Grand lobby entrance',
        '24/7 concierge desk',
        'Secure package room',
        'Co-working lounge',
      ],
    },
  ];

  return (
    <div ref={pageRef} className="min-h-screen bg-white">

      <div className="max-w-[1360px] mx-auto px-4 md:px-8 lg:px-20 py-6 md:py-10">
        {/* Back Button */}
        <button
          ref={backBtnRef}
          onClick={() => navigate(`/${currentLang}/projects`)}
          className="flex items-center gap-2 text-[rgb(44,44,44)] hover:text-black transition-colors mb-6"
          style={{ fontFamily: 'Geist, sans-serif' }}
        >
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            {isRTL ? (
              <path d="M5 12h14M12 19l7-7-7-7" />
            ) : (
              <path d="M19 12H5M12 19l-7-7 7-7" />
            )}
          </svg>
          {t('project.backToProjects')}
        </button>

        {/* Gallery - Full Width */}
        <PropertyGallery images={property.gallery || [property.image]} propertyName={property.name} />

        {/* Title Only */}
        <div className="mt-6 mb-4">
          <h1
            ref={titleRef}
            className="text-[28px] md:text-[36px] lg:text-[40px] font-semibold text-[rgb(44,44,44)]"
            style={{ fontFamily: 'Geist, sans-serif' }}
          >
            {property.projectName}
          </h1>
        </div>

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

            {/* Custom Sections - Deployable by Owner */}
            {customSections.map((section, index) => (
              <div key={section.id} className="project-section">
                <ProjectSection {...section} index={index} />
              </div>
            ))}

            {/* Location */}
            <PropertyLocation
              address={property.map_location?.address}
              lat={property.map_location?.lat}
              lng={property.map_location?.lng}
            />

            {/* Properties in This Project */}
            <div className="py-6 border-t border-b border-[rgb(230,230,230)]">
              {/* Section Header with Title and See More */}
              <div className="flex items-center justify-between mb-6">
                <h3
                  className="text-[20px] md:text-[24px] font-semibold text-[rgb(44,44,44)]"
                  style={{ fontFamily: 'Geist, sans-serif' }}
                >
                  {t('project.propertiesInProject')}
                </h3>

                {projectProperties.length >= 1 && (
                  <button
                    onClick={() => navigate(`/${currentLang}/?project=${encodeURIComponent(property.projectName)}`)}
                    className="flex items-center gap-1 text-[14px] font-light text-[rgb(44,44,44)] hover:text-black transition-colors"
                    style={{ fontFamily: 'Geist, sans-serif' }}
                  >
                    {t('project.seeMore')}
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <path d="M5 12h14M12 5l7 7-7 7" />
                    </svg>
                  </button>
                )}
              </div>

              {/* Properties Grid - Show up to 3 */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {projectProperties.slice(0, 3).map((projProperty) => (
                  <div key={projProperty.id} className="property-card">
                    <PropertyCard
                      images={[projProperty.image]}
                      price={formatPrice(projProperty.price)}
                      title={projProperty.name}
                      location={`${projProperty.projectName}, ${projProperty.location}`}
                      beds={projProperty.beds}
                      baths={projProperty.baths}
                      space={projProperty.sqft}
                      propertyType={projProperty.propertyType}
                      isNew={projProperty.featured}
                      onClick={() => navigate(`/${currentLang}/property/${projProperty.id}`)}
                    />
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Sidebar - Right */}
          <div className="order-2">
            <ProjectContactSidebar
              property={property}
              whatsappNumber={property.whatsappNumber}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProjectDetail;
