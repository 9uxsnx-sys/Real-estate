import React, { useState, useRef, useEffect, useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { motion, AnimatePresence } from 'framer-motion';
import gsap from 'gsap';
import { useProjects } from '../../hooks';

interface HeroSectionProps {
  searchQuery: string;
  onSearchChange: (value: string) => void;
  sortBy: string;
  onSortChange: (value: string) => void;
  propertyType: string;
  onPropertyTypeChange: (value: string) => void;
  selectedProject: string;
  onProjectChange: (value: string) => void;
  minSpace: string;
  onMinSpaceChange: (value: string) => void;
  maxSpace: string;
  onMaxSpaceChange: (value: string) => void;
  resultsCount: number;
}

interface DropdownOption {
  value: string;
  label: string;
}

const CustomDropdown: React.FC<{
  value: string;
  options: DropdownOption[];
  onChange: (value: string) => void;
  placeholder?: string;
  width?: string;
}> = ({ value, options, onChange, placeholder = 'Select...', width = 'w-auto' }) => {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const selectedLabel = options.find((opt) => opt.value === value)?.label || placeholder;

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <div ref={dropdownRef} className={`relative ${width}`} style={{ zIndex: isOpen ? 100 : 'auto' }}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-full px-4 py-2.5 bg-[rgb(243,243,243)] rounded-full text-[14px] font-light outline-none cursor-pointer flex items-center justify-between gap-2 hover:bg-[rgb(230,230,230)] transition-colors whitespace-nowrap"
        style={{ fontFamily: 'Geist, sans-serif' }}
      >
        <span className="truncate">{selectedLabel}</span>
        <svg
          width="16"
          height="16"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          className={`transition-transform flex-shrink-0 ${isOpen ? 'rotate-180' : ''}`}
        >
          <path d="M6 9l6 6 6-6" />
        </svg>
      </button>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            className="absolute top-full left-0 mt-2 w-full min-w-[180px] bg-white rounded-2xl shadow-xl border border-[rgb(230,230,230)] overflow-visible z-[9999] max-h-[300px] overflow-y-auto"
            initial={{ opacity: 0, y: -8, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1, transition: { duration: 0.2, ease: "easeOut" } }}
            exit={{ opacity: 0, y: -8, scale: 0.98, transition: { duration: 0.15 } }}
          >
          {options.map((option) => (
            <button
              key={option.value}
              onClick={() => {
                onChange(option.value);
                setIsOpen(false);
              }}
              className={`w-full px-4 py-3 text-left text-[14px] font-light transition-colors flex items-center justify-between ${
                value === option.value
                  ? 'bg-[rgb(243,243,243)] text-[rgb(44,44,44)]'
                  : 'text-[rgb(136,136,136)] hover:bg-[rgb(250,250,250)]'
              }`}
              style={{ fontFamily: 'Geist, sans-serif' }}
            >
              <span className="truncate">{option.label}</span>
              {value === option.value && (
                <svg
                  width="16"
                  height="16"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="rgb(102,252,117)"
                  strokeWidth="2"
                  className="flex-shrink-0 ml-2"
                >
                  <path d="M20 6L9 17l-5-5" />
                </svg>
              )}
            </button>
          ))}
        </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export const HeroSection: React.FC<HeroSectionProps> = ({
  searchQuery,
  onSearchChange,
  sortBy,
  onSortChange,
  propertyType,
  onPropertyTypeChange,
  selectedProject,
  onProjectChange,
  minSpace,
  onMinSpaceChange,
  maxSpace,
  onMaxSpaceChange,
  resultsCount,
}) => {
  const { t, i18n } = useTranslation();
  const heroRef = useRef<HTMLDivElement>(null);
  const titleRef = useRef<HTMLHeadingElement>(null);
  const searchBarRef = useRef<HTMLDivElement>(null);

  const { projects } = useProjects(i18n.language);

  useEffect(() => {
    const ctx = gsap.context(() => {
      const tl = gsap.timeline();

      tl.fromTo(titleRef.current,
        { opacity: 0, y: 50, scale: 0.95 },
        { opacity: 1, y: 0, scale: 1, duration: 0.8, ease: 'power3.out' }
      );

      tl.fromTo(searchBarRef.current,
        { opacity: 0, y: 30 },
        { opacity: 1, y: 0, duration: 0.6, ease: 'power3.out' },
        '-=0.4'
      );
    }, heroRef);

    return () => ctx.revert();
  }, []);

  const projectOptions = useMemo(() => {
    return [
      { value: '', label: t('hero.allProjects') },
      ...projects.map((p) => ({ value: p.name, label: p.name })),
    ];
  }, [projects, t]);

  const sortOptions = [
    { value: 'featured', label: t('hero.featured') },
    { value: 'price-low', label: t('hero.priceLow') },
    { value: 'price-high', label: t('hero.priceHigh') },
    { value: 'newest', label: t('hero.newest') },
  ];

  const propertyTypes = [
    { value: '', label: t('hero.allTypes') },
    { value: 'studio', label: 'Studio' },
    { value: 'f1', label: 'F1' },
    { value: 'f2', label: 'F2' },
    { value: 'f3', label: 'F3' },
    { value: 'f4', label: 'F4' },
    { value: 'f5+', label: 'F5+' },
    { value: 'garage', label: 'Garage' },
  ];

  return (
    <section ref={heroRef} className="bg-white border-b border-[rgb(230,230,230)] py-6 md:py-10 relative z-[100]">
      <div className="max-w-[1360px] mx-auto px-4 md:px-8 lg:px-20">
        <div className="mb-4 md:mb-6">
          <h1
            ref={titleRef}
            className="text-[32px] md:text-[40px] lg:text-[48px] font-semibold text-[rgb(44,44,44)] leading-[1.2]"
            style={{ fontFamily: 'Geist, sans-serif' }}
          >
            {t('hero.ourProperties')}
          </h1>
        </div>

        <div ref={searchBarRef} className="bg-[rgb(250,250,250)] rounded-2xl md:rounded-3xl p-3 md:p-5">

          <div className="flex flex-col gap-3 md:hidden">
            <div className="relative">
              <svg
                className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-[rgb(136,136,136)]"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
              >
                <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0118 0z" />
                <circle cx="12" cy="10" r="3" />
              </svg>
              <input
                type="text"
                placeholder={t('hero.searchByLocation')}
                value={searchQuery}
                onChange={(e) => onSearchChange(e.target.value)}
                className="w-full pl-10 pr-4 py-3 bg-white rounded-full text-[14px] font-light outline-none border border-[rgb(230,230,230)] focus:border-[rgb(199,199,199)] transition-colors"
                style={{ fontFamily: 'Geist, sans-serif' }}
              />
            </div>

            <div className="grid grid-cols-2 gap-2">
              <CustomDropdown
                value={sortBy}
                options={sortOptions}
                onChange={onSortChange}
                width="w-full"
              />
              <CustomDropdown
                value={propertyType}
                options={propertyTypes}
                onChange={onPropertyTypeChange}
                width="w-full"
              />
            </div>

            <div className="grid grid-cols-2 gap-2">
              <CustomDropdown
                value={selectedProject}
                options={projectOptions}
                onChange={onProjectChange}
                placeholder={t('hero.allProjects')}
                width="w-full"
              />
              <div className="flex items-center gap-2 bg-white rounded-full px-3 py-2.5 border border-[rgb(230,230,230)]">
                <input
                  type="number"
                  placeholder={t('hero.min')}
                  value={minSpace}
                  onChange={(e) => onMinSpaceChange(e.target.value)}
                  className="w-full text-[14px] font-light outline-none bg-transparent text-center"
                  style={{ fontFamily: 'Geist, sans-serif' }}
                />
                <span className="text-[rgb(136,136,136)] text-[12px]">-</span>
                <input
                  type="number"
                  placeholder={t('hero.max')}
                  value={maxSpace}
                  onChange={(e) => onMaxSpaceChange(e.target.value)}
                  className="w-full text-[14px] font-light outline-none bg-transparent text-center"
                  style={{ fontFamily: 'Geist, sans-serif' }}
                />
                <span className="text-[12px] text-[rgb(136,136,136)] font-light">m²</span>
              </div>
            </div>
          </div>

          <div className="hidden md:flex lg:hidden flex-col gap-3">
            <div className="relative">
              <svg
                className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-[rgb(136,136,136)]"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
              >
                <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0118 0z" />
                <circle cx="12" cy="10" r="3" />
              </svg>
              <input
                type="text"
                placeholder={t('hero.searchByLocation')}
                value={searchQuery}
                onChange={(e) => onSearchChange(e.target.value)}
                className="w-full pl-12 pr-4 py-3 bg-white rounded-full text-[15px] font-light outline-none border border-[rgb(230,230,230)] focus:border-[rgb(199,199,199)] transition-colors"
                style={{ fontFamily: 'Geist, sans-serif' }}
              />
            </div>

            <div className="grid grid-cols-3 gap-3">
              <CustomDropdown
                value={sortBy}
                options={sortOptions}
                onChange={onSortChange}
                width="w-full"
              />
              <CustomDropdown
                value={propertyType}
                options={propertyTypes}
                onChange={onPropertyTypeChange}
                width="w-full"
              />
              <CustomDropdown
                value={selectedProject}
                options={projectOptions}
                onChange={onProjectChange}
                placeholder={t('hero.allProjects')}
                width="w-full"
              />
            </div>

            <div className="flex items-center gap-3">
              <input
                type="number"
                placeholder={t('hero.min')}
                value={minSpace}
                onChange={(e) => onMinSpaceChange(e.target.value)}
                className="w-28 px-4 py-2.5 bg-[rgb(243,243,243)] rounded-full text-[14px] font-light outline-none border border-transparent hover:border-[rgb(199,199,199)] transition-colors"
                style={{ fontFamily: 'Geist, sans-serif' }}
              />
              <span className="text-[rgb(136,136,136)] font-light">-</span>
              <input
                type="number"
                placeholder={t('hero.max')}
                value={maxSpace}
                onChange={(e) => onMaxSpaceChange(e.target.value)}
                className="w-28 px-4 py-2.5 bg-[rgb(243,243,243)] rounded-full text-[14px] font-light outline-none border border-transparent hover:border-[rgb(199,199,199)] transition-colors"
                style={{ fontFamily: 'Geist, sans-serif' }}
              />
            </div>
          </div>

          <div className="hidden lg:flex items-center gap-3">
            <div className="relative flex-1">
              <svg
                className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-[rgb(136,136,136)]"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
              >
                <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0118 0z" />
                <circle cx="12" cy="10" r="3" />
              </svg>
              <input
                type="text"
                placeholder={t('hero.searchByLocation')}
                value={searchQuery}
                onChange={(e) => onSearchChange(e.target.value)}
                className="w-full pl-12 pr-4 py-3 bg-[rgb(243,243,243)] rounded-full text-[14px] font-light outline-none hover:bg-[rgb(230,230,230)] transition-colors"
                style={{ fontFamily: 'Geist, sans-serif' }}
              />
            </div>

            <CustomDropdown
              value={sortBy}
              options={sortOptions}
              onChange={onSortChange}
              width="w-[140px]"
            />
            <CustomDropdown
              value={propertyType}
              options={propertyTypes}
              onChange={onPropertyTypeChange}
              width="w-[140px]"
            />
            <CustomDropdown
              value={selectedProject}
              options={projectOptions}
              onChange={onProjectChange}
              placeholder={t('hero.allProjects')}
              width="w-[160px]"
            />

            <div className="flex items-center gap-2">
              <input
                type="number"
                placeholder={t('hero.min')}
                value={minSpace}
                onChange={(e) => onMinSpaceChange(e.target.value)}
                className="w-24 px-3 py-2 bg-[rgb(243,243,243)] rounded-full text-[14px] font-light outline-none hover:bg-[rgb(230,230,230)] transition-colors"
                style={{ fontFamily: 'Geist, sans-serif' }}
              />
              <span className="text-[rgb(136,136,136)]">-</span>
              <input
                type="number"
                placeholder={t('hero.max')}
                value={maxSpace}
                onChange={(e) => onMaxSpaceChange(e.target.value)}
                className="w-24 px-3 py-2 bg-[rgb(243,243,243)] rounded-full text-[14px] font-light outline-none hover:bg-[rgb(230,230,230)] transition-colors"
                style={{ fontFamily: 'Geist, sans-serif' }}
              />
            </div>

            <span
              className="ml-auto text-[14px] text-[rgb(136,136,136)] font-light whitespace-nowrap"
              style={{ fontFamily: 'Geist, sans-serif' }}
            >
              {t('hero.propertiesCount', { count: resultsCount })}
            </span>
          </div>
        </div>
      </div>
    </section>
  );
};