import React, { useEffect, useRef } from 'react';
import { useSearchParams } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import gsap from 'gsap';
import { PropertyCard } from '@/components/ui/property-card';
import { HeroSection } from '../components/filters';
import { properties } from '../data/properties';
import { formatPrice } from '../utils/formatters';

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

  // Filter and sort properties
  const filteredProperties = React.useMemo(() => {
    let result = [...properties];

    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      result = result.filter(
        (p) =>
          p.name.toLowerCase().includes(query) ||
          p.location.toLowerCase().includes(query)
      );
    }

    if (selectedProject) {
      result = result.filter((p) => p.projectName === selectedProject);
    }

    if (propertyTypeFilter) {
      result = result.filter((p) => p.propertyType === propertyTypeFilter);
    }

    if (minSpace) {
      const min = parseInt(minSpace);
      if (!isNaN(min)) {
        result = result.filter((p) => p.spaceSqm >= min);
      }
    }
    if (maxSpace) {
      const max = parseInt(maxSpace);
      if (!isNaN(max)) {
        result = result.filter((p) => p.spaceSqm <= max);
      }
    }

    switch (sortBy) {
      case 'price-low':
        result.sort((a, b) => a.price - b.price);
        break;
      case 'price-high':
        result.sort((a, b) => b.price - a.price);
        break;
      case 'newest':
        result.reverse();
        break;
      case 'featured':
      default:
        result.sort((a, b) => (b.featured ? 1 : 0) - (a.featured ? 1 : 0));
        break;
    }

    return result;
  }, [sortBy, searchQuery, selectedProject, propertyTypeFilter, minSpace, maxSpace]);

  const visibleProperties = filteredProperties.slice(0, visibleCount);
  const hasMore = visibleCount < filteredProperties.length;

  // GSAP stagger animation for property cards
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
  }, [visibleProperties]);

  const handleLoadMore = () => {
    setVisibleCount((prev) => Math.min(prev + 8, filteredProperties.length));
  };

  const handlePropertyClick = (id: string) => {
    if (onPropertyClick) {
      onPropertyClick(id);
    }
  };

  return (
    <div className="min-h-screen bg-white">
      {/* Hero Section with Unified Search Bar */}
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
        resultsCount={filteredProperties.length}
      />

      {/* Properties Grid/List */}
      <section className="py-12 md:py-16 relative" style={{ zIndex: 1 }}>
        <div className="max-w-[1360px] mx-auto px-6 sm:px-4 md:px-8 lg:px-20">
          {/* Grid/List */}
          <div ref={gridRef} className="grid gap-6 grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {visibleProperties.map((property) => (
              <div key={property.id} className="property-card">
                <PropertyCard
                  imageUrl={property.image}
                  price={formatPrice(property.price)}
                  title={property.name}
                  location={`${property.projectName}, ${property.location}`}
                  beds={property.beds}
                  baths={property.baths}
                  space={property.sqft}
                  propertyType={property.propertyType}
                  isNew={property.featured}
                  onClick={() => handlePropertyClick(property.id)}
                />
              </div>
            ))}
          </div>

          {/* Empty State */}
          {filteredProperties.length === 0 && (
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

          {/* Load More Button */}
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
