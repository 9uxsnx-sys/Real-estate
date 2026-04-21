// Custom React hooks for GSAP animations
import { useEffect, useRef, useState } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

// Hook for scroll-triggered animations
export const useScrollAnimation = (options = {}) => {
  const ref = useRef<HTMLDivElement>(null);
  
  useEffect(() => {
    if (!ref.current) return;
    
    const scrollTrigger = ScrollTrigger.create({
      trigger: ref.current,
      start: 'top 85%',
      end: 'top 60%',
      toggleActions: 'play none none reverse',
      ...options
    });
    
    return () => scrollTrigger.kill();
  }, [options]);
  
  return ref;
};

// Hook for entrance animations
export const useEntranceAnimation = (
  animation: 'fadeInUp' | 'fadeInDown' | 'fadeInLeft' | 'fadeInRight' | 'scaleIn' = 'fadeInUp',
  delay: number = 0,
  duration: number = 0.8
) => {
  const ref = useRef<HTMLDivElement>(null);
  const [hasAnimated, setHasAnimated] = useState(false);
  
  useEffect(() => {
    if (!ref.current || hasAnimated) return;
    
    const animations = {
      fadeInUp: { opacity: 0, y: 60 },
      fadeInDown: { opacity: 0, y: -60 },
      fadeInLeft: { opacity: 0, x: -60 },
      fadeInRight: { opacity: 0, x: 60 },
      scaleIn: { opacity: 0, scale: 0.8 }
    };
    
    gsap.fromTo(ref.current, 
      animations[animation],
      {
        opacity: 1,
        y: animation.includes('Up') || animation.includes('Down') ? 0 : undefined,
        x: animation.includes('Left') || animation.includes('Right') ? 0 : undefined,
        scale: animation === 'scaleIn' ? 1 : undefined,
        duration,
        delay,
        ease: 'power3.out',
        onComplete: () => setHasAnimated(true)
      }
    );
  }, [animation, delay, duration, hasAnimated]);
  
  return ref;
};

// Hook for stagger animations
export const useStaggerAnimation = (stagger: number = 0.1) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const childrenRef = useRef<NodeListOf<Element>>(null);
  
  useEffect(() => {
    if (!containerRef.current) return;
    
    childrenRef.current = containerRef.current.children;
    
    gsap.fromTo(childrenRef.current,
      { opacity: 0, y: 40 },
      {
        opacity: 1,
        y: 0,
        duration: 0.7,
        stagger,
        ease: 'power3.out',
        scrollTrigger: {
          trigger: containerRef.current,
          start: 'top 85%'
        }
      }
    );
  }, [stagger]);
  
  return containerRef;
};

// Hook for parallax effect
export const useParallax = (speed: number = 0.5) => {
  const ref = useRef<HTMLDivElement>(null);
  
  useEffect(() => {
    if (!ref.current) return;
    
    gsap.to(ref.current, {
      yPercent: speed * 100,
      ease: 'none',
      scrollTrigger: {
        trigger: ref.current,
        start: 'top bottom',
        end: 'bottom top',
        scrub: true
      }
    });
  }, [speed]);
  
  return ref;
};

export { useRef };
