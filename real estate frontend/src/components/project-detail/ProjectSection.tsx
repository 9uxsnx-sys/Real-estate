import * as React from 'react';
import { useState } from 'react';
import { Check } from 'lucide-react';
import { ImageGalleryModal } from '../ui/ImageGalleryModal';

export interface ProjectSectionData {
  id: string;
  title: string;
  images: string[];
  description?: string;
  features?: string[];
}

interface ProjectSectionProps extends ProjectSectionData {
  index?: number;
}

export const ProjectSection: React.FC<ProjectSectionProps> = ({
  title,
  images,
  description,
  features,
}) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalInitialIndex, setModalInitialIndex] = useState(0);

  // Ensure we have at least 4 images (use duplicates if needed)
  const displayImages = images.length >= 4 
    ? images.slice(0, 4) 
    : [...images, ...Array(4 - images.length).fill(images[0] || '')];

  const remainingCount = images.length - 4;
  const hasMoreImages = remainingCount > 0;

  const openModal = (startIndex: number) => {
    setModalInitialIndex(startIndex);
    setIsModalOpen(true);
  };

  return (
    <div className="py-6 border-b border-[rgb(230,230,230)]">
      {/* Section Title */}
      <h2
        className="text-[24px] md:text-[28px] font-semibold text-[rgb(44,44,44)] mb-6"
        style={{ fontFamily: 'Geist, sans-serif' }}
      >
        {title}
      </h2>

      {/* Gallery Grid - 2x2 Layout */}
      <div className="grid grid-cols-2 gap-4 mb-6">
        {displayImages.map((image, index) => (
          <div 
            key={index} 
            className="relative aspect-[16/9] overflow-hidden rounded-2xl cursor-pointer"
            onClick={() => openModal(index)}
          >
            <img
              src={image}
              alt={`${title} - ${index + 1}`}
              className="w-full h-full object-cover hover:scale-105 transition-transform duration-500"
            />
            {/* +X Overlay on the last image when more exist */}
            {index === 3 && hasMoreImages && (
              <div 
                className="absolute inset-0 flex items-center justify-center rounded-2xl"
                style={{ backgroundColor: 'rgba(0, 0, 0, 0.6)' }}
              >
                <span 
                  className="text-white text-2xl font-semibold"
                  style={{ fontFamily: 'Geist, sans-serif' }}
                >
                  +{remainingCount}
                </span>
              </div>
            )}
          </div>
        ))}
      </div>

      {/* Description Section */}
      {description && (
        <div className="mb-6">
          <h3
            className="text-[18px] md:text-[20px] font-semibold text-[rgb(44,44,44)] mb-3"
            style={{ fontFamily: 'Geist, sans-serif' }}
          >
            Overview
          </h3>
          <p
            className="text-[14px] md:text-[16px] text-[rgb(44,44,44)] font-light leading-relaxed"
            style={{ fontFamily: 'Geist, sans-serif' }}
          >
            {description}
          </p>
        </div>
      )}

      {/* Features Section */}
      {features && features.length > 0 && (
        <div>
          <h3
            className="text-[18px] md:text-[20px] font-semibold text-[rgb(44,44,44)] mb-3"
            style={{ fontFamily: 'Geist, sans-serif' }}
          >
            Features
          </h3>
          <div className="flex flex-col gap-2">
            {features.map((feature, index) => (
              <div key={index} className="flex items-center gap-3">
                <Check
                  size={16}
                  strokeWidth={2}
                  className="text-[rgb(100,100,100)] flex-shrink-0"
                />
                <span
                  className="text-[14px] text-[rgb(44,44,44)] font-light"
                  style={{ fontFamily: 'Geist, sans-serif' }}
                >
                  {feature}
                </span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Image Gallery Modal */}
      <ImageGalleryModal
        images={images}
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        initialIndex={modalInitialIndex}
      />
    </div>
  );
};

export default ProjectSection;
