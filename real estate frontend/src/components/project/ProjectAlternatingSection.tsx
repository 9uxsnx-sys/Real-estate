import * as React from 'react';
import { motion } from 'framer-motion';
import { LargeImageComponent } from './LargeImageComponent';
import { InfoCardComponent } from './InfoCardComponent';

interface Project {
  id: string;
  name: string;
  location: string;
  image: string;
  propertyCount: number;
  priceRange: { min: number; max: number };
  types: string[];
}

interface ProjectAlternatingSectionProps {
  project: Project;
  index: number;
  onExplore: () => void;
}

export const ProjectAlternatingSection = ({
  project,
  index,
  onExplore,
}: ProjectAlternatingSectionProps) => {
  const projectNumber = String(index + 1).padStart(2, '0');
  const isReversed = index % 2 === 1;

  const getDescription = (name: string) => {
    const descriptions: Record<string, string> = {
      'Bel Air Heights': 'An exclusive collection of luxury residences nestled in the prestigious hills of Bel Air. Each property offers panoramic city views and ultimate privacy.',
      'Malibu Shores': 'Beachfront living at its finest with direct ocean access, contemporary coastal design, and breathtaking Pacific sunset views.',
      'Beverly Hills Residences': 'Iconic Beverly Hills living with timeless elegance, classic architecture, and proximity to world-class amenities.',
      'Marina Del Rey Apartments': 'Modern waterfront living in a vibrant coastal community with marina views and resort-style amenities.',
      'Downtown LA Lofts': 'Urban sophistication in the heart of the city featuring industrial-chic lofts with stunning skyline views.',
      'Hollywood Hills Estates': 'Prestigious estates with dramatic architecture and breathtaking views of the city lights.',
    };
    return descriptions[name] || `Discover luxury living at ${name}, featuring exceptional design and premium amenities.`;
  };

  return (
    <section className="py-20 md:py-28 lg:py-36 bg-white border-b border-[rgb(230,230,230)]">
      <div className="max-w-[1280px] mx-auto px-6 sm:px-8 lg:px-12">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-50px' }}
          transition={{ duration: 0.6, ease: [0.25, 0.1, 0.25, 1] }}
          className="flex flex-col lg:grid lg:grid-cols-12 gap-8 lg:gap-10"
        >
          {isReversed ? (
            // Reversed layout: InfoCard left (40%), LargeImage right (60%)
            <>
              <InfoCardComponent
                image={project.image}
                title={project.name}
                description={getDescription(project.name)}
                onExplore={onExplore}
                projectNumber={projectNumber}
              />
              <LargeImageComponent
                image={project.image}
                alt={project.name}
              />
            </>
          ) : (
            // Normal layout: LargeImage left (60%), InfoCard right (40%)
            <>
              <LargeImageComponent
                image={project.image}
                alt={project.name}
              />
              <InfoCardComponent
                image={project.image}
                title={project.name}
                description={getDescription(project.name)}
                onExplore={onExplore}
                projectNumber={projectNumber}
              />
            </>
          )}
        </motion.div>
      </div>
    </section>
  );
};

export default ProjectAlternatingSection;
