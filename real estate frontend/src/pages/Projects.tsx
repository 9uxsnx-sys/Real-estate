import React, { useEffect, useRef } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import gsap from 'gsap';
import { ArrowRight } from 'lucide-react';
import { ProjectAlternatingSection } from '../components/project';
import { useProjects } from '../hooks';
import type { Project } from '../types';

interface ProjectWithMeta extends Project {
  propertyCount: number;
  priceRange: { min: number; max: number };
}

export const Projects: React.FC = () => {
  const navigate = useNavigate();
  const { lang } = useParams<{ lang: string }>();
  const { t } = useTranslation();
  const currentLang = lang || 'en';

  const headerRef = useRef<HTMLDivElement>(null);
  const ctaRef = useRef<HTMLDivElement>(null);

  const { projects, loading, error } = useProjects(currentLang);

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.fromTo(headerRef.current,
        { opacity: 0, y: 50, scale: 0.95 },
        { opacity: 1, y: 0, scale: 1, duration: 0.8, ease: 'power3.out' }
      );

      gsap.fromTo(ctaRef.current,
        { opacity: 0, y: 40 },
        {
          opacity: 1,
          y: 0,
          duration: 0.7,
          ease: 'power3.out',
          scrollTrigger: {
            trigger: ctaRef.current,
            start: 'top 85%'
          }
        }
      );
    });

    return () => ctx.revert();
  }, []);

  const handleProjectClick = (documentId: string) => {
    navigate(`/${currentLang}/projects/${documentId}`);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-gray-200 border-t-gray-800 rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600">Loading projects...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="text-center">
          <p className="text-red-600 mb-4">Failed to load projects. Please try again.</p>
          <button
            onClick={() => window.location.reload()}
            className="px-6 py-3 bg-black text-white rounded-full"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white">
      <section className="py-16 md:py-20 lg:py-24 border-b border-[rgb(230,230,230)]">
        <div className="max-w-[1360px] mx-auto px-6 sm:px-4 md:px-8 lg:px-20">
          <div ref={headerRef}>
            <h1
              className="text-[32px] md:text-[40px] lg:text-[48px] font-semibold text-[rgb(44,44,44)] leading-[1.2]"
              style={{ fontFamily: 'Geist, sans-serif' }}
            >
              {t('hero.ourProjects')}
            </h1>
          </div>
        </div>
      </section>

      {projects.slice(0, 4).map((project, index) => (
        <ProjectAlternatingSection
          key={project.documentId}
          project={project as ProjectWithMeta}
          index={index}
          onExplore={() => handleProjectClick(project.documentId)}
        />
      ))}

      <section className="py-16 md:py-20 bg-[rgb(248,248,248)]">
        <div className="max-w-[1360px] mx-auto px-6 sm:px-4 md:px-8 lg:px-20">
          <div ref={ctaRef} className="text-center max-w-xl mx-auto">
            <h3
              className="text-[24px] md:text-[28px] font-semibold text-[rgb(44,44,44)] mb-4"
              style={{ fontFamily: 'Geist, sans-serif' }}
            >
              {t('project.readyToFind')}
            </h3>
            <p
              className="text-[14px] md:text-[16px] text-[rgb(136,136,136)] font-light mb-8"
              style={{ fontFamily: 'Geist, sans-serif' }}
            >
              {t('project.browseDescription')}
            </p>
            <button
              onClick={() => navigate(`/${currentLang}`)}
              className="inline-flex items-center gap-2 px-8 py-4 bg-black text-white rounded-full font-light text-[14px] transition-all duration-300 hover:bg-[rgb(44,44,44)] hover:scale-105 group"
              style={{ fontFamily: 'Geist, sans-serif' }}
            >
              {t('project.exploreProperties')} <ArrowRight className="w-4 h-4 ml-2 transition-transform group-hover:translate-x-1" />
            </button>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Projects;