// Preloader component with GSAP animations
import { useEffect, useRef, useState } from 'react';
import gsap from 'gsap';

export const Preloader: React.FC = () => {
  const [isLoading, setIsLoading] = useState(true);
  const preloaderRef = useRef<HTMLDivElement>(null);
  const textRef = useRef<HTMLDivElement>(null);
  const progressRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      const tl = gsap.timeline();
      
      // Initial state
      tl.set(preloaderRef.current, { opacity: 0 });
      tl.set(textRef.current, { opacity: 0, y: 20 });
      tl.set(progressRef.current, { scaleX: 0 });
      
      // Animate in
      tl.to(preloaderRef.current, {
        opacity: 1,
        duration: 0.4,
        ease: 'power2.out'
      });
      
      tl.to(textRef.current, {
        opacity: 1,
        y: 0,
        duration: 0.5,
        ease: 'power3.out'
      }, '-=0.2');
      
      tl.to(progressRef.current, {
        scaleX: 1,
        duration: 1.5,
        ease: 'power2.inOut'
      }, '-=0.3');
      
      // Animate out
      tl.to([textRef.current, progressRef.current], {
        opacity: 0,
        y: -20,
        duration: 0.4,
        ease: 'power2.in'
      });
      
      tl.to(preloaderRef.current, {
        opacity: 0,
        duration: 0.5,
        ease: 'power2.in',
        onComplete: () => setIsLoading(false)
      }, '-=0.2');
    });
    
    return () => ctx.revert();
  }, []);

  if (!isLoading) return null;

  return (
    <div
      ref={preloaderRef}
      className="fixed inset-0 z-[9999] flex items-center justify-center bg-white"
    >
      <div className="text-center">
        {/* Logo */}
        <div ref={textRef} className="mb-8">
          <img
            src="https://storage.googleapis.com/download/storage/v1/b/prd-shared-services.firebasestorage.app/o/h2m-assets%2F8f47f6f46f13b18c94590c08695180a388e97844.png%3Fwidth=300&amp;height=209?generation=1775379090743841&amp;alt=media"
            alt="VistaHaven"
            className="w-16 h-16 object-contain mx-auto mb-4"
          />
          <h2
            className="text-2xl font-semibold text-[rgb(44,44,44)]"
            style={{ fontFamily: 'Geist, sans-serif' }}
          >
            VistaHaven
          </h2>
        </div>

        {/* Progress Bar */}
        <div className="w-48 h-1 bg-gray-200 rounded-full overflow-hidden mx-auto">
          <div
            ref={progressRef}
            className="h-full bg-[rgb(44,44,44)] rounded-full"
            style={{ transformOrigin: 'left' }}
          />
        </div>
      </div>
    </div>
  );
};

export default Preloader;
