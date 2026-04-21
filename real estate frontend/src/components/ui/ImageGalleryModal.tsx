import React, { useState, useEffect, useRef } from 'react';
import { createPortal } from 'react-dom';
import gsap from 'gsap';
import { X, ChevronLeft, ChevronRight } from 'lucide-react';

interface ImageGalleryModalProps {
  images: string[];
  isOpen: boolean;
  onClose: () => void;
  initialIndex?: number;
}

export const ImageGalleryModal: React.FC<ImageGalleryModalProps> = ({
  images,
  isOpen,
  onClose,
  initialIndex = 0,
}) => {
  const [currentIndex, setCurrentIndex] = useState(initialIndex);
  const [zoom, setZoom] = useState(1);
  const [imageOffset, setImageOffset] = useState(0);
  const modalRef = useRef<HTMLDivElement>(null);
  const imageRef = useRef<HTMLImageElement>(null);
  const overlayRef = useRef<HTMLDivElement>(null);
  const gsapContextRef = useRef<gsap.Context | null>(null);

  // Touch state
  const touchStartX = useRef(0);
  const touchStartY = useRef(0);
  const touchCurrentX = useRef(0);
  const isDragging = useRef(false);
  const lastPinchDistance = useRef(0);

  // Calculate pinch distance between two touches
  const getPinchDistance = (touches: TouchList) => {
    const dx = touches[0].clientX - touches[1].clientX;
    const dy = touches[0].clientY - touches[1].clientY;
    return Math.sqrt(dx * dx + dy * dy);
  };

  // Handle touch start
  const handleTouchStart = (e: TouchEvent) => {
    if (e.touches.length === 1) {
      // Single touch - prepare for swipe
      touchStartX.current = e.touches[0].clientX;
      touchStartY.current = e.touches[0].clientY;
      touchCurrentX.current = e.touches[0].clientX;
      isDragging.current = true;
    } else if (e.touches.length === 2) {
      // Two fingers - prepare for pinch zoom
      lastPinchDistance.current = getPinchDistance(e.touches);
      isDragging.current = false;
    }
  };

  // Handle touch move
  const handleTouchMove = (e: TouchEvent) => {
    if (e.touches.length === 1 && isDragging.current && zoom === 1) {
      // Single finger swipe - only when not zoomed
      const deltaX = e.touches[0].clientX - touchStartX.current;
      setImageOffset(deltaX);
    } else if (e.touches.length === 2) {
      // Two finger pinch zoom
      const currentDistance = getPinchDistance(e.touches);
      const scaleChange = currentDistance / lastPinchDistance.current;
      
      const newZoom = Math.min(Math.max(zoom * scaleChange, 0.5), 3);
      setZoom(newZoom);
      
      if (imageRef.current) {
        gsap.to(imageRef.current, {
          scale: newZoom,
          duration: 0.1,
          ease: 'power2.out'
        });
      }
      
      lastPinchDistance.current = currentDistance;
      isDragging.current = false;
    }
  };

  // Handle touch end
  const handleTouchEnd = () => {
    if (isDragging.current && zoom === 1) {
      const threshold = 80;
      
      if (imageOffset > threshold) {
        // Swiped right - go to previous
        handlePrev();
      } else if (imageOffset < -threshold) {
        // Swiped left - go to next
        handleNext();
      }
      
      // Animate back to center
      if (imageRef.current) {
        gsap.to(imageRef.current, {
          x: 0,
          duration: 0.3,
          ease: 'power3.out'
        });
      }
      
      setImageOffset(0);
    }
    
    isDragging.current = false;
  };

  // Reset state when modal opens
  useEffect(() => {
    if (isOpen) {
      if (gsapContextRef.current) {
        gsapContextRef.current.revert();
      }

      setCurrentIndex(initialIndex);
      setZoom(1);
      setImageOffset(0);

      if (imageRef.current) {
        gsap.set(imageRef.current, { 
          scale: 1, 
          x: 0, 
          y: 0,
          clearProps: 'transform'
        });
      }

      document.body.style.overflow = 'hidden';
      document.documentElement.style.overflow = 'hidden';

      gsapContextRef.current = gsap.context(() => {
        const tl = gsap.timeline();
        
        tl.fromTo(overlayRef.current,
          { opacity: 0 },
          { opacity: 1, duration: 0.3, ease: 'power2.out' }
        );
        
        if (imageRef.current) {
          tl.fromTo(imageRef.current,
            { opacity: 0, scale: 0.8 },
            { opacity: 1, scale: 1, duration: 0.5, ease: 'back.out(1.7)' },
            '-=0.2'
          );
        }
      }, modalRef);
    }

    return () => {
      if (gsapContextRef.current) {
        gsapContextRef.current.revert();
        gsapContextRef.current = null;
      }

      if (imageRef.current) {
        gsap.set(imageRef.current, { clearProps: 'all' });
      }

      document.body.style.overflow = '';
      document.documentElement.style.overflow = '';
    };
  }, [isOpen, initialIndex]);

  // Handle image change
  useEffect(() => {
    if (isOpen && imageRef.current) {
      setZoom(1);
      setImageOffset(0);
      
      gsap.fromTo(imageRef.current,
        { opacity: 0, scale: 0.95 },
        { opacity: 1, scale: 1, duration: 0.4, ease: 'power3.out' }
      );
    }
  }, [currentIndex, isOpen]);

  // Add touch event listeners
  useEffect(() => {
    const modalElement = modalRef.current;
    if (!modalElement || !isOpen) return;

    modalElement.addEventListener('touchstart', handleTouchStart, { passive: true });
    modalElement.addEventListener('touchmove', handleTouchMove, { passive: false });
    modalElement.addEventListener('touchend', handleTouchEnd);

    return () => {
      modalElement.removeEventListener('touchstart', handleTouchStart);
      modalElement.removeEventListener('touchmove', handleTouchMove);
      modalElement.removeEventListener('touchend', handleTouchEnd);
    };
  }, [isOpen, zoom, imageOffset, currentIndex]);

  const handleNext = () => {
    setCurrentIndex((prev) => (prev + 1) % images.length);
  };

  const handlePrev = () => {
    setCurrentIndex((prev) => (prev - 1 + images.length) % images.length);
  };

  // Keyboard navigation (for desktop)
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
      if (e.key === 'ArrowRight') handleNext();
      if (e.key === 'ArrowLeft') handlePrev();
    };

    if (isOpen) {
      window.addEventListener('keydown', handleKeyDown);
    }

    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [isOpen, onClose]);

  // Mouse wheel zoom (for desktop)
  useEffect(() => {
    const handleWheel = (e: WheelEvent) => {
      if (!isOpen) return;
      e.preventDefault();
      
      const delta = e.deltaY > 0 ? -0.2 : 0.2;
      const newZoom = Math.min(Math.max(zoom + delta, 0.5), 3);
      setZoom(newZoom);
      
      if (imageRef.current) {
        gsap.to(imageRef.current, {
          scale: newZoom,
          duration: 0.2,
          ease: 'power2.out'
        });
      }
    };

    const modalElement = modalRef.current;
    if (modalElement) {
      modalElement.addEventListener('wheel', handleWheel, { passive: false });
    }

    return () => {
      if (modalElement) {
        modalElement.removeEventListener('wheel', handleWheel);
      }
    };
  }, [isOpen, zoom]);

  // Complete cleanup on unmount
  useEffect(() => {
    return () => {
      if (gsapContextRef.current) {
        gsapContextRef.current.revert();
      }
      document.body.style.overflow = '';
      document.documentElement.style.overflow = '';
    };
  }, []);

  if (!isOpen) return null;

  const ModalContent = () => (
    <div
      ref={overlayRef}
      className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/95"
      onClick={onClose}
      style={{ 
        position: 'fixed', 
        top: 0, 
        left: 0, 
        right: 0, 
        bottom: 0,
        width: '100vw',
        height: '100vh',
        overflow: 'hidden'
      }}
    >
      <div
        ref={modalRef}
        className="relative w-screen h-screen flex flex-col items-center justify-center touch-none"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close Button */}
        <button
          className="absolute top-6 right-6 z-10 p-3 bg-white/10 hover:bg-white/20 rounded-full transition-colors"
          onClick={onClose}
        >
          <X className="w-6 h-6 text-white" />
        </button>

        {/* Image Container - Centered in viewport */}
        <div className="relative flex-1 flex items-center justify-center w-full">
          <img
            ref={imageRef}
            src={images[currentIndex]}
            alt={`Gallery image ${currentIndex + 1}`}
            className="max-w-full max-h-full object-contain select-none"
            style={{ 
              transform: `scale(${zoom})`,
              transition: zoom === 1 ? 'none' : 'transform 0.3s ease-out',
              display: 'block'
            }}
            draggable={false}
          />
        </div>

        {/* Instagram-style Dots Indicator */}
        {images.length > 1 && (
          <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex gap-2 items-center justify-center">
            {images.map((_, index) => (
              <button
                key={index}
                onClick={() => setCurrentIndex(index)}
                className={`transition-all duration-300 rounded-full ${
                  index === currentIndex
                    ? 'w-8 h-2 bg-white'
                    : 'w-2 h-2 bg-white/40 hover:bg-white/60'
                }`}
              />
            ))}
          </div>
        )}

        {/* Navigation Arrows - Desktop & Tablet Only (md and up) */}
        {images.length > 1 && (
          <>
            <button
              className="hidden md:flex absolute left-6 top-1/2 -translate-y-1/2 p-3 bg-white/10 hover:bg-white/20 rounded-full transition-colors z-50"
              onClick={handlePrev}
            >
              <ChevronLeft className="w-6 h-6 text-white" />
            </button>
            <button
              className="hidden md:flex absolute right-6 top-1/2 -translate-y-1/2 p-3 bg-white/10 hover:bg-white/20 rounded-full transition-colors z-50"
              onClick={handleNext}
            >
              <ChevronRight className="w-6 h-6 text-white" />
            </button>
          </>
        )}

        {/* Hint text for gestures */}
        {images.length > 1 && (
          <>
            <div className="absolute top-6 left-1/2 -translate-x-1/2 text-white/60 text-xs font-light select-none pointer-events-none hidden md:block">
              Use mouse wheel to zoom • Click arrows to navigate
            </div>
            <div className="absolute top-6 left-1/2 -translate-x-1/2 text-white/60 text-xs font-light select-none pointer-events-none md:hidden">
              Swipe to navigate • Pinch to zoom
            </div>
          </>
        )}
      </div>
    </div>
  );

  // Use portal to render modal at document body level
  return createPortal(<ModalContent />, document.body);
};

export default ImageGalleryModal;
