// GSAP utility functions and configuration
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { ScrollToPlugin } from 'gsap/ScrollToPlugin';

// Register GSAP plugins
gsap.registerPlugin(ScrollTrigger, ScrollToPlugin);

// Common animation presets
export const fadeInUp = (element: gsap.TweenTarget, delay: number = 0) => {
  return gsap.fromTo(element, 
    { opacity: 0, y: 60 },
    { 
      opacity: 1, 
      y: 0, 
      duration: 0.8, 
      delay,
      ease: 'power3.out'
    }
  );
};

export const fadeInDown = (element: gsap.TweenTarget, delay: number = 0) => {
  return gsap.fromTo(element,
    { opacity: 0, y: -60 },
    {
      opacity: 1,
      y: 0,
      duration: 0.8,
      delay,
      ease: 'power3.out'
    }
  );
};

export const fadeInLeft = (element: gsap.TweenTarget, delay: number = 0) => {
  return gsap.fromTo(element,
    { opacity: 0, x: -60 },
    {
      opacity: 1,
      x: 0,
      duration: 0.8,
      delay,
      ease: 'power3.out'
    }
  );
};

export const fadeInRight = (element: gsap.TweenTarget, delay: number = 0) => {
  return gsap.fromTo(element,
    { opacity: 0, x: 60 },
    {
      opacity: 1,
      x: 0,
      duration: 0.8,
      delay,
      ease: 'power3.out'
    }
  );
};

export const scaleIn = (element: gsap.TweenTarget, delay: number = 0) => {
  return gsap.fromTo(element,
    { opacity: 0, scale: 0.8 },
    {
      opacity: 1,
      scale: 1,
      duration: 0.6,
      delay,
      ease: 'back.out(1.7)'
    }
  );
};

export const staggerFadeIn = (
  elements: gsap.TweenTarget,
  stagger: number = 0.1,
  delay: number = 0
) => {
  return gsap.fromTo(elements,
    { opacity: 0, y: 40 },
    {
      opacity: 1,
      y: 0,
      duration: 0.7,
      stagger,
      delay,
      ease: 'power3.out'
    }
  );
};

// Scroll-triggered animations
export const scrollFadeInUp = (element: string | Element) => {
  return gsap.fromTo(element,
    { opacity: 0, y: 60 },
    {
      opacity: 1,
      y: 0,
      duration: 0.8,
      ease: 'power3.out',
      scrollTrigger: {
        trigger: element,
        start: 'top 85%',
        end: 'top 60%',
        toggleActions: 'play none none reverse'
      }
    }
  );
};

export const scrollFadeInLeft = (element: string | Element) => {
  return gsap.fromTo(element,
    { opacity: 0, x: -60 },
    {
      opacity: 1,
      x: 0,
      duration: 0.8,
      ease: 'power3.out',
      scrollTrigger: {
        trigger: element,
        start: 'top 85%',
        toggleActions: 'play none none reverse'
      }
    }
  );
};

export const scrollFadeInRight = (element: string | Element) => {
  return gsap.fromTo(element,
    { opacity: 0, x: 60 },
    {
      opacity: 1,
      x: 0,
      duration: 0.8,
      ease: 'power3.out',
      scrollTrigger: {
        trigger: element,
        start: 'top 85%',
        toggleActions: 'play none none reverse'
      }
    }
  );
};

export const scrollScaleIn = (element: string | Element) => {
  return gsap.fromTo(element,
    { opacity: 0, scale: 0.9 },
    {
      opacity: 1,
      scale: 1,
      duration: 0.8,
      ease: 'power2.out',
      scrollTrigger: {
        trigger: element,
        start: 'top 85%',
        toggleActions: 'play none none reverse'
      }
    }
  );
};

// Smooth scroll to element
export const smoothScrollTo = (element: string | Element, duration: number = 1) => {
  gsap.to(window, {
    duration,
    scrollTo: { y: element, autoKill: false },
    ease: 'power3.inOut'
  });
};

// Parallax effect
export const parallax = (element: string | Element, speed: number = 0.5) => {
  gsap.to(element, {
    yPercent: speed * 100,
    ease: 'none',
    scrollTrigger: {
      trigger: element,
      start: 'top bottom',
      end: 'bottom top',
      scrub: true
    }
  });
};

export { gsap, ScrollTrigger, ScrollToPlugin };
