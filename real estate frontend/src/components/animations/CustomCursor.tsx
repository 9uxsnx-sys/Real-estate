// Custom cursor component with GSAP
import { useEffect, useRef } from 'react';
import gsap from 'gsap';

export const CustomCursor: React.FC = () => {
  const cursorRef = useRef<HTMLDivElement>(null);
  const cursorDotRef = useRef<HTMLDivElement>(null);
  const cursorOutlineRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const cursor = cursorRef.current;
    const dot = cursorDotRef.current;
    const outline = cursorOutlineRef.current;

    if (!cursor || !dot || !outline) return;

    // Hide default cursor
    document.body.style.cursor = 'none';

    // Mouse move handler
    const onMouseMove = (e: MouseEvent) => {
      gsap.to(dot, {
        x: e.clientX - 4,
        y: e.clientY - 4,
        duration: 0.1,
        ease: 'power2.out'
      });

      gsap.to(outline, {
        x: e.clientX - 20,
        y: e.clientY - 20,
        duration: 0.3,
        ease: 'power2.out'
      });
    };

    // Hover handler for interactive elements
    const onMouseEnter = () => {
      gsap.to(outline, {
        scale: 1.5,
        opacity: 0.5,
        duration: 0.3,
        ease: 'power2.out'
      });
      
      gsap.to(dot, {
        scale: 0.5,
        duration: 0.3,
        ease: 'power2.out'
      });
    };

    const onMouseLeave = () => {
      gsap.to(outline, {
        scale: 1,
        opacity: 1,
        duration: 0.3,
        ease: 'power2.out'
      });
      
      gsap.to(dot, {
        scale: 1,
        duration: 0.3,
        ease: 'power2.out'
      });
    };

    // Click handler
    const onMouseDown = () => {
      gsap.to([dot, outline], {
        scale: 0.8,
        duration: 0.1,
        ease: 'power2.out'
      });
    };

    const onMouseUp = () => {
      gsap.to([dot, outline], {
        scale: 1,
        duration: 0.3,
        ease: 'elastic.out(1, 0.3)'
      });
    };

    window.addEventListener('mousemove', onMouseMove);
    
    const interactiveElements = document.querySelectorAll('a, button, input, [role="button"]');
    interactiveElements.forEach(el => {
      el.addEventListener('mouseenter', onMouseEnter);
      el.addEventListener('mouseleave', onMouseLeave);
    });
    
    window.addEventListener('mousedown', onMouseDown);
    window.addEventListener('mouseup', onMouseUp);

    return () => {
      window.removeEventListener('mousemove', onMouseMove);
      interactiveElements.forEach(el => {
        el.removeEventListener('mouseenter', onMouseEnter);
        el.removeEventListener('mouseleave', onMouseLeave);
      });
      window.removeEventListener('mousedown', onMouseDown);
      window.removeEventListener('mouseup', onMouseUp);
      document.body.style.cursor = 'auto';
    };
  }, []);

  return (
    <div
      ref={cursorRef}
      className="fixed top-0 left-0 pointer-events-none z-[9998] mix-blend-difference"
    >
      {/* Cursor dot */}
      <div
        ref={cursorDotRef}
        className="absolute w-2 h-2 bg-[rgb(102,252,117)] rounded-full"
      />
      
      {/* Cursor outline */}
      <div
        ref={cursorOutlineRef}
        className="absolute w-10 h-10 border-2 border-[rgb(102,252,117)] rounded-full opacity-50"
      />
    </div>
  );
};

export default CustomCursor;
