import React from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate, useParams } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';

const languages = [
  { code: 'en', label: 'EN', name: 'English' },
  { code: 'fr', label: 'FR', name: 'Français' },
  { code: 'ar', label: 'AR', name: 'العربية' },
];

const dropdownVariants = {
  hidden: { opacity: 0, y: -8, scale: 0.96 },
  visible: { opacity: 1, y: 0, scale: 1, transition: { duration: 0.2, ease: "easeOut" } },
  exit: { opacity: 0, y: -8, scale: 0.96, transition: { duration: 0.15 } }
};

export const LanguageSwitcher: React.FC = () => {
  const { i18n } = useTranslation();
  const navigate = useNavigate();
  const { lang } = useParams<{ lang: string }>();
  const [isOpen, setIsOpen] = React.useState(false);

  const currentLang = lang || i18n.language || 'en';
  const isRTL = currentLang === 'ar';
  const currentLanguage = languages.find((l) => l.code === currentLang) || languages[0];

  const handleLanguageChange = (code: string) => {
    // Get current path and extract the path after the language prefix
    const currentPath = window.location.pathname;
    const pathParts = currentPath.split('/').filter(Boolean);
    
    // Check if first segment is a language code
    const langCodes = languages.map(l => l.code);
    const firstSegment = pathParts[0];
    const hasLangPrefix = langCodes.includes(firstSegment);
    
    // Build new path: keep everything after language prefix, add new language
    let newPath: string;
    if (hasLangPrefix) {
      // Replace existing language prefix
      const restOfPath = pathParts.slice(1).join('/');
      newPath = `/${code}/${restOfPath}`;
    } else {
      // Add language prefix to current path
      newPath = `/${code}${currentPath}`;
    }
    
    // Ensure path ends correctly (handle root path case)
    if (newPath === `/${code}/` || newPath === `/${code}`) {
      newPath = `/${code}/`;
    }
    
    // Update language and navigate
    i18n.changeLanguage(code);
    navigate(newPath);
    setIsOpen(false);
  };

  return (
    <div className="relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-1 px-3 py-1.5 text-[13px] font-medium text-[rgb(44,44,44)] hover:text-black transition-colors border border-[rgb(230,230,230)] rounded-full"
        style={{ fontFamily: 'Geist, sans-serif' }}
      >
        <span>{currentLanguage.label}</span>
        <svg
          width="12"
          height="12"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          className={`transition-transform ${isOpen ? 'rotate-180' : ''}`}
        >
          <path d="M6 9l6 6 6-6" />
        </svg>
      </button>

      <AnimatePresence>
        {isOpen && (
          <>
            <motion.div
              className="fixed inset-0 z-[9999]"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsOpen(false)}
            />
            <motion.div 
              className={`absolute top-full mt-2 py-2 bg-white border border-[rgb(230,230,230)] rounded-xl shadow-lg z-[10000] min-w-[120px] ${isRTL ? 'right-0' : 'left-0'}`}
              variants={dropdownVariants}
              initial="hidden"
              animate="visible"
              exit="exit"
            >
              {languages.map((language) => (
                <button
                  key={language.code}
                  onClick={() => handleLanguageChange(language.code)}
                  className={`w-full px-4 py-2 text-start text-[13px] transition-colors flex items-center gap-2 ${
                    currentLang === language.code
                      ? 'bg-[rgb(245,245,245)] text-black font-medium'
                      : 'text-[rgb(44,44,44)] hover:bg-[rgb(250,250,250)]'
                  }`}
                  style={{ fontFamily: 'Geist, sans-serif' }}
                >
                  <span className="font-medium">{language.label}</span>
                  <span className="text-[rgb(136,136,136)]">{language.name}</span>
                </button>
              ))}
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
};
