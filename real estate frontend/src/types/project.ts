import type { Property } from './property';

export interface Project {
  id: number;
  documentId: string;
  name: string;
  short_description: string;
  city: string;
  place: string;
  description?: string;
  first_image: string;
  second_image: string;
  google_map_embed?: string;
  properties?: Property[];
}

export interface ProjectFeature {
  id: string;
  name: string;
}

export interface CustomSection {
  id: string;
  title?: string;
  description?: string;
  gallery?: string[];
  features?: ProjectFeature[];
}

export interface StrapiProjectResponse {
  data: {
    id: number;
    documentId: string;
    attributes: Omit<Project, 'id' | 'documentId'>;
  };
  meta: any;
}
