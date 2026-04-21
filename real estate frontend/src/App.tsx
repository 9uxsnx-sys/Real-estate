import React, { useEffect, useState } from 'react';
import { Routes, Route, useNavigate, useParams, Navigate, useLocation } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import gsap from 'gsap';
import { Navigation } from './components/layout';
import { ScrollToTop } from './components/ScrollToTop';
import { Preloader, PageTransition } from './components/animations';
import { PropertiesListing, PropertyDetail, Projects, ProjectDetail } from './pages';
import './i18n';

const supportedLangs = ['en', 'fr', 'ar'];

// LocalizedApp wrapper to handle language validation and RTL
const LocalizedApp: React.FC = () => {
  const { lang } = useParams<{ lang: string }>();
  const { i18n } = useTranslation();
  const location = useLocation();

  useEffect(() => {
    if (lang && supportedLangs.includes(lang)) {
      i18n.changeLanguage(lang);
      // Set RTL for Arabic
      document.documentElement.dir = lang === 'ar' ? 'rtl' : 'ltr';
      document.documentElement.lang = lang;
    }
  }, [lang, i18n]);

  // If lang is not supported, redirect to /en
  if (!lang || !supportedLangs.includes(lang)) {
    const newPath = location.pathname.replace(`/${lang}/`, '/en/').replace(`/${lang}`, '/en');
    return <Navigate to={newPath || '/en'} replace />;
  }

  return (
    <div className="min-h-screen bg-white">
      <ScrollToTop />
      <Routes>
        <Route
          path="/"
          element={
            <PageTransition>
              <Navigation />
              <LocalizedPropertiesListing />
            </PageTransition>
          }
        />
        <Route 
          path="property/:id" 
          element={
            <PageTransition>
              <LocalizedPropertyDetail />
            </PageTransition>
          } 
        />
        <Route 
          path="projects" 
          element={
            <PageTransition>
              <Navigation />
              <LocalizedProjects />
            </PageTransition>
          } 
        />
        <Route 
          path="projects/:projectId" 
          element={
            <PageTransition>
              <Navigation />
              <LocalizedProjectDetail />
            </PageTransition>
          } 
        />
      </Routes>
    </div>
  );
};

// Wrapper components that pass language to pages
const LocalizedPropertiesListing: React.FC = () => {
  const navigate = useNavigate();
  const { lang } = useParams<{ lang: string }>();

  const handlePropertyClick = (id: string) => {
    navigate(`/${lang}/property/${id}`);
  };

  return <PropertiesListing onPropertyClick={handlePropertyClick} />;
};

const LocalizedPropertyDetail: React.FC = () => {
  return <PropertyDetail />;
};

const LocalizedProjects: React.FC = () => {
  return <Projects />;
};

const LocalizedProjectDetail: React.FC = () => {
  return <ProjectDetail />;
};

// Root redirect component
const RootRedirect: React.FC = () => {
  return <Navigate to="/en" replace />;
};

// Main App with preloader
export default function App() {
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    // Small delay to ensure everything is loaded
    const timer = setTimeout(() => setIsLoaded(true), 100);
    return () => clearTimeout(timer);
  }, []);

  return (
    <>
      {!isLoaded && <Preloader />}
      <Routes>
        {/* Language-prefixed routes */}
        <Route path="/:lang/*" element={<LocalizedApp />} />

        {/* Redirect root to /en */}
        <Route path="/" element={<RootRedirect />} />

        {/* Catch all - redirect to /en */}
        <Route path="*" element={<RootRedirect />} />
      </Routes>
    </>
  );
}
