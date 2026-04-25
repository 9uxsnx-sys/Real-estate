import { fetchApi, fetchApiById, API_URL } from './api';
import type { Project, StrapiProjectResponse, StrapiResponse } from '../types';

export async function fetchProjects(
  locale?: string
): Promise<StrapiResponse<Project[]>> {
  const params: Record<string, string> = {
    populate: '*',
  };
  if (locale) {
    params.locale = locale;
  }
  return fetchApi<StrapiResponse<Project[]>>('/api/projects', params);
}

export async function fetchProjectByDocumentId(
  documentId: string,
  locale?: string
): Promise<StrapiProjectResponse | null> {
  try {
    const params: Record<string, string> = { populate: '*' };
    if (locale) {
      params.locale = locale;
    }
    return await fetchApiById<StrapiProjectResponse>(
      '/api/projects',
      documentId
    );
  } catch (error) {
    console.error('Error fetching project:', error);
    return null;
  }
}

export async function fetchProjectById(
  id: number,
  locale?: string
): Promise<StrapiProjectResponse | null> {
  try {
    const params: Record<string, string> = { populate: '*' };
    if (locale) {
      params.locale = locale;
    }
    return await fetchApiById<StrapiProjectResponse>('/api/projects', String(id));
  } catch (error) {
    console.error('Error fetching project:', error);
    return null;
  }
}

export function getProjectImageUrl(imagePath: string | null | undefined): string {
  if (!imagePath) {
    return '/assets/images/placeholder.jpg';
  }

  if (imagePath.startsWith('http://') || imagePath.startsWith('https://')) {
    return imagePath;
  }

  if (imagePath.startsWith('/uploads/')) {
    return `${API_URL}${imagePath}`;
  }

  if (imagePath.startsWith('/assets/')) {
    return imagePath;
  }

  return `${API_URL}/uploads/${imagePath}`;
}

export function formatProjectForDisplay(project: any): Project {
  return {
    id: project.id,
    documentId: project.documentId,
    name: project.name,
    short_description: project.short_description || '',
    city: project.city,
    place: project.place,
    description: project.description,
    first_image: project.first_image,
    second_image: project.second_image,
    google_map_embed: project.google_map_embed,
    properties: project.properties?.map(formatPropertyForDisplay) || [],
  };
}

function formatPropertyForDisplay(property: any): any {
  return {
    id: property.id,
    documentId: property.documentId,
    name: property.name,
    area: property.area,
    city: property.city,
    price: property.price,
    property_type: property.property_type,
    space_sqm: property.space_sqm,
    beds: property.beds,
    baths: property.baths,
    image: property.image,
    property_code: property.property_code,
  };
}