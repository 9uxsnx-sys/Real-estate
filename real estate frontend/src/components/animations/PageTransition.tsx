// Page transition component with GSAP
import { useEffect, useRef } from 'react';
import { useLocation } from 'react-router-dom';
import gsap from 'gsap';

export const PageTransition: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const pageRef = useRef<HTMLDivElement>(null);
  const location = useLocation();
  
  useEffect(() => {
    const ctx = gsap.context(() => {
      // Page entrance animation
      gsap.fromTo(pageRef.current,
        { 
          opacity: 0,
          y: 30,
          scale: 0.98
        },
        { 
          opacity: 1,
          y: 0,
          scale: 1,
          duration: 0.6,
          ease: 'power3.out'
        }
      );
      
      // Animate child elements with stagger
      if (pageRef.current) {
        const children = pageRef.current.querySelectorAll(
          'section, header, footer, .animate-on-load'
        );
        
        gsap.fromTo(children,
          { opacity: 0, y: 40 },
          {
            opacity: 1,
            y: 0,
            duration: 0.7,
            stagger: 0.15,
            ease: 'power3.out',
            delay: 0.2
          }
        );
      }
    }, pageRef);
    
    return () => ctx.revert();
  }, [location.pathname]);
  
  return (
    <div ref={pageRef} className="page-transition-wrapper">
      {children}
    </div>
  );
};

export default PageTransition;
