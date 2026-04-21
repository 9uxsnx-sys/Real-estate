import { Project } from '../types';

export const projects: Project[] = [
  {
    id: '1',
    name: 'Marina Bay',
    location: 'Dubai Marina, Dubai',
    description: 'Luxury waterfront living with stunning views',
    image: '/assets/images/marina-bay.jpg',
    propertyCount: 4,
  },
  {
    id: '2',
    name: 'Downtown Views',
    location: 'Downtown Dubai, Dubai',
    description: 'Modern apartments in the heart of the city',
    image: '/assets/images/downtown-views.jpg',
    propertyCount: 4,
  },
  {
    id: '3',
    name: 'Palm Residences',
    location: 'Palm Jumeirah, Dubai',
    description: 'Exclusive beachfront properties',
    image: '/assets/images/palm-residences.jpg',
    propertyCount: 4,
  },
  {
    id: '4',
    name: 'Garden Heights',
    location: 'Jumeirah Golf Estates, Dubai',
    description: 'Serene golf course living',
    image: '/assets/images/garden-heights.jpg',
    propertyCount: 4,
  },
];

export const getProjectById = (id: string): Project | undefined => {
  return projects.find(project => project.id === id);
};

export const getProjectProperties = (projectId: string): string[] => {
  const projectIndex = parseInt(projectId) - 1;
  const startIndex = projectIndex * 4;
  return Array.from({ length: 4 }, (_, i) => String(startIndex + i + 1));
};
