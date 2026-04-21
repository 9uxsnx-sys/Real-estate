import React, { useState } from 'react';
import { ImageGalleryModal } from '../ui/ImageGalleryModal';

interface PropertyGalleryProps {
  images: string[];
  propertyName: string;
}

export const PropertyGallery: React.FC<PropertyGalleryProps> = ({ images, propertyName }) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalInitialIndex, setModalInitialIndex] = useState(0);

  // Ensure we have at least 3 images (use duplicates if needed)
  const galleryImages = images.length >= 3 
    ? images.slice(0, 3) 
    : [...images, ...Array(3 - images.length).fill(images[0] || '')];

  const [mainImage, ...sideImages] = galleryImages;
  const remainingCount = images.length - 3;
  const hasMoreImages = remainingCount > 0;

  const openModal = (startIndex: number) => {
    setModalInitialIndex(startIndex);
    setIsModalOpen(true);
  };

  return (
    <>
      <div className="grid grid-cols-1 md:grid-cols-[1fr_0.5fr] md:grid-rows-2 gap-4 w-full">
        {/* Main Large Image - Spans 2 rows */}
        <div 
          className="md:col-span-1 md:row-span-2 aspect-[16/10] md:aspect-auto md:h-full overflow-hidden rounded-3xl cursor-pointer"
          onClick={() => openModal(0)}
        >
          <img
            src={mainImage}
            alt={`${propertyName} - Main`}
            className="w-full h-full object-cover hover:scale-105 transition-transform duration-500"
          />
        </div>

        {/* Side Images - 2 images stacked vertically, 1 per row */}
        {sideImages.map((image, index) => (
          <div 
            key={index} 
            className="relative aspect-[16/9] md:aspect-auto md:h-full overflow-hidden rounded-3xl cursor-pointer"
            onClick={() => openModal(index + 1)}
          >
            <img
              src={image}
              alt={`${propertyName} - ${index + 2}`}
              className="w-full h-full object-cover hover:scale-105 transition-transform duration-500"
            />
            {/* +X Overlay on the 2nd side image (bottom-right) */}
            {index === 1 && hasMoreImages && (
              <div 
                className="absolute inset-0 flex items-center justify-center rounded-3xl"
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

      {/* Image Gallery Modal */}
      <ImageGalleryModal
        images={images}
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        initialIndex={modalInitialIndex}
      />
    </>
  );
};
