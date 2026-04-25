import React, { useEffect, useRef } from 'react';
import { useSearchParams } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import gsap from 'gsap';
import { PropertyCard } from '@/components/ui/property-card';
import { HeroSection } from '../components/filters';
import { useProperties } from '../hooks';
import { formatPrice, getImageUrl } from '../utils';

interface PropertiesListingProps {
  onPropertyClick?: (id: string) => void;
}

export const PropertiesListing: React.FC<PropertiesListingProps> = ({ onPropertyClick }) => {
  const { t } = useTranslation();
  const [searchParams] = useSearchParams();
  const projectParam = searchParams.get('project');

  const [sortBy, setSortBy] = React.useState('featured');
  const [searchQuery, setSearchQuery] = React.useState('');
  const [selectedProject, setSelectedProject] = React.useState(projectParam || '');
  const [propertyTypeFilter, setPropertyTypeFilter] = React.useState('');
  const [minSpace, setMinSpace] = React.useState('');
  const [maxSpace, setMaxSpace] = React.useState('');

  const [visibleCount, setVisibleCount] = React.useState(8);
  const gridRef = useRef<HTMLDivElement>(null);

  const { properties, loading, error } = useProperties({
    search: searchQuery,
    propertyType: propertyTypeFilter || undefined,
    projectName: selectedProject || undefined,
    minSpace: minSpace ? parseInt(minSpace) : undefined,
    maxSpace: maxSpace ? parseInt(maxSpace) : undefined,
    sortBy: sortBy as any,
  });

  const visibleProperties = properties.slice(0, visibleCount);
  const hasMore = visibleCount < properties.length;

  useEffect(() => {
    if (!gridRef.current) return;

    const cards = gridRef.current.querySelectorAll('.property-card');

    gsap.fromTo(cards,
      {
        opacity: 0,
        y: 60,
        scale: 0.95
      },
      {
        opacity: 1,
        y: 0,
        scale: 1,
        duration: 0.7,
        stagger: 0.08,
        ease: 'power3.out',
        scrollTrigger: {
          trigger: gridRef.current,
          start: 'top 85%'
        }
      }
    );
  }, [visibleProperties.length]);

  const handleLoadMore = () => {
    setVisibleCount((prev) => Math.min(prev + 8, properties.length));
  };

  const handlePropertyClick = (id: string) => {
    if (onPropertyClick) {
      onPropertyClick(id);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-gray-200 border-t-gray-800 rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600">Loading properties...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="text-center">
          <p className="text-red-600 mb-4">Failed to load properties. Please try again.</p>
          <button
            onClick={() => window.location.reload()}
            className="px-6 py-3 bg-black text-white rounded-full"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white">
      <HeroSection
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
        sortBy={sortBy}
        onSortChange={setSortBy}
        propertyType={propertyTypeFilter}
        onPropertyTypeChange={setPropertyTypeFilter}
        selectedProject={selectedProject}
        onProjectChange={setSelectedProject}
        minSpace={minSpace}
        onMinSpaceChange={setMinSpace}
        maxSpace={maxSpace}
        onMaxSpaceChange={setMaxSpace}
        resultsCount={properties.length}
      />

      <section className="py-12 md:py-16 relative" style={{ zIndex: 1 }}>
        <div className="max-w-[1360px] mx-auto px-6 sm:px-4 md:px-8 lg:px-20">
          <div ref={gridRef} className="grid gap-6 grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {visibleProperties.map((property) => (
              <div key={property.documentId} className="property-card">
                <PropertyCard
                  imageUrl={getImageUrl(property.image)}
                  price={formatPrice(property.price)}
                  title={property.name}
                  location={property.project ? `${property.project.name}, ${property.area}` : `${property.area}, ${property.city}`}
                  beds={property.beds}
                  baths={property.baths}
                  space={property.space_sqm}
                  propertyType={property.property_type}
                  onClick={() => handlePropertyClick(property.documentId)}
                />
              </div>
            ))}
          </div>

          {properties.length === 0 && (
            <div className="text-center py-16">
              <svg
                width="64"
                height="64"
                viewBox="0 0 24 24"
                fill="none"
                stroke="rgb(199,199,199)"
                strokeWidth="1.5"
                className="mx-auto mb-4"
              >
                <path d="M3 9l9-7 9 7v11a2 2 0 01-2 2H5a2 2 0 01-2-2z" />
                <polyline points="9 22 9 12 15 12 15 22" />
              </svg>
              <p
                className="text-[18px] text-[rgb(44,44,44)] font-light mb-2"
                style={{ fontFamily: 'Geist, sans-serif' }}
              >
                {t('common.notFound')}
              </p>
              <p
                className="text-[14px] text-[rgb(136,136,136)] font-light"
                style={{ fontFamily: 'Geist, sans-serif' }}
              >
                {t('common.tryAgain')}
              </p>
            </div>
          )}

          {hasMore && (
            <div className="text-center mt-12">
              <button
                onClick={handleLoadMore}
                className="px-8 py-4 bg-black text-white rounded-full font-light text-[16px] transition-all duration-300 hover:bg-[rgb(44,44,44)] hover:scale-105 hover:shadow-lg"
                style={{ fontFamily: 'Geist, sans-serif' }}
              >
                {t('common.showMore')}
              </button>
            </div>
          )}
        </div>
      </section>
    </div>
  );
};