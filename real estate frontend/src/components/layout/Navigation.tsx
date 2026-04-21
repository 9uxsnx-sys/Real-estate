import React, { useEffect, useRef } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { motion, AnimatePresence } from 'framer-motion';
import gsap from 'gsap';
import { LanguageSwitcher } from './LanguageSwitcher';

export const Navigation: React.FC = () => {
  const navigate = useNavigate();
  const { lang } = useParams<{ lang: string }>();
  const { t } = useTranslation();
  const [mobileMenuOpen, setMobileMenuOpen] = React.useState(false);
  const currentLang = lang || 'en';
  
  const navRef = useRef<HTMLDivElement>(null);
  const logoRef = useRef<HTMLAnchorElement>(null);
  const linksRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      const tl = gsap.timeline();
      
      tl.fromTo(logoRef.current,
        { opacity: 0, x: -30 },
        { opacity: 1, x: 0, duration: 0.6, ease: 'power3.out' }
      );
      
      if (linksRef.current) {
        const links = linksRef.current.querySelectorAll('a');
        tl.fromTo(links,
          { opacity: 0, y: -10 },
          { opacity: 1, y: 0, duration: 0.5, stagger: 0.1, ease: 'power3.out' },
          '-=0.3'
        );
      }
    }, navRef);
    
    return () => ctx.revert();
  }, []);

  return (
    <nav ref={navRef} className="sticky top-0 z-[10000] bg-white/90 backdrop-blur border-b border-white">
      <div className="max-w-[1360px] mx-auto px-4 md:px-8 lg:px-20">
        <div className="flex items-center justify-between h-20">
          {/* Logo */}
          <a
            ref={logoRef}
            href={`/${currentLang}`}
            onClick={(e) => {
              e.preventDefault();
              navigate(`/${currentLang}`);
            }}
            className="flex items-center gap-2"
          >
            <img
              src="https://storage.googleapis.com/download/storage/v1/b/prd-shared-services.firebasestorage.app/o/h2m-assets%2F8f47f6f46f13b18c94590c08695180a388e97844.png%3Fwidth=300&amp;height=209?generation=1775379090743841&amp;alt=media"
              alt="VistaHaven"
              className="w-10 h-10 object-contain"
            />
            <span
              className="font-semibold text-[20px] uppercase text-[rgb(44,44,44)]"
              style={{ fontFamily: 'Geist, sans-serif' }}
            >
              VistaHaven
            </span>
          </a>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="md:hidden p-2"
          >
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              {mobileMenuOpen ? (
                <path d="M18 6L6 18M6 6l12 12" />
              ) : (
                <path d="M3 12h18M3 6h18M3 18h18" />
              )}
            </svg>
          </button>

          {/* Desktop Navigation Links */}
          <div ref={linksRef} className="hidden md:flex items-center gap-8">
            <a
              href={`/${currentLang}`}
              onClick={(e) => {
                e.preventDefault();
                navigate(`/${currentLang}`);
              }}
              className="text-[14px] font-light text-[rgb(44,44,44)] hover:text-[rgb(136,136,136)] transition-colors"
              style={{ fontFamily: 'Geist, sans-serif' }}
            >
              {t('nav.properties')}
            </a>
            <a
              href={`/${currentLang}/projects`}
              onClick={(e) => {
                e.preventDefault();
                navigate(`/${currentLang}/projects`);
              }}
              className="text-[14px] font-light text-[rgb(44,44,44)] hover:text-[rgb(136,136,136)] transition-colors"
              style={{ fontFamily: 'Geist, sans-serif' }}
            >
              {t('nav.projects')}
            </a>
          </div>

          {/* Language Switcher - Desktop */}
          <div className="hidden md:flex items-center">
            <LanguageSwitcher />
          </div>

          {/* Mobile Menu */}
          <AnimatePresence>
            {mobileMenuOpen && (
              <motion.div 
                className="absolute top-full left-0 right-0 bg-white border-t border-[rgb(230,230,230)] shadow-[0_8px_30px_rgb(0,0,0,0.12)] rounded-b-xl py-4 px-4 md:hidden"
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0, transition: { duration: 0.3, ease: [0.25, 0.46, 0.45, 0.94] } }}
                exit={{ opacity: 0, y: -20, transition: { duration: 0.2 } }}
              >
                <a
                  href={`/${currentLang}`}
                  onClick={(e) => {
                    e.preventDefault();
                    navigate(`/${currentLang}`);
                    setMobileMenuOpen(false);
                  }}
                  className="block py-3 text-[16px] font-light text-[rgb(44,44,44)]"
                  style={{ fontFamily: 'Geist, sans-serif' }}
                >
                  {t('nav.properties')}
                </a>
              <a
                href={`/${currentLang}/projects`}
                onClick={(e) => {
                  e.preventDefault();
                  navigate(`/${currentLang}/projects`);
                  setMobileMenuOpen(false);
                }}
                className="block py-3 text-[16px] font-light text-[rgb(44,44,44)]"
                style={{ fontFamily: 'Geist, sans-serif' }}
              >
                {t('nav.projects')}
              </a>
              {/* Language Switcher - Mobile */}
              <div className="py-3 border-t border-[rgb(230,230,230)] mt-3">
                <LanguageSwitcher />
              </div>
            </motion.div>
          )}
          </AnimatePresence>
        </div>
      </div>
    </nav>
  );
};
