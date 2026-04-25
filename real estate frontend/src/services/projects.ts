import { fetchApi, API_URL } from './api';
import type { Project } from '../types';

interface StrapiListResponse {
  data: any[];
  meta: {
    pagination?: {
      page: number;
      pageSize: number;
      pageCount: number;
      total: number;
    };
  };
}

export async function fetchProjects(
  locale?: string
): Promise<Project[]> {
  const params: Record<string, string> = {
    populate: '*',
  };
  if (locale) {
    params.locale = locale;
  }
  const response = await fetchApi<StrapiListResponse>('/api/projects', params);

  const projectData = Array.isArray(response.data) ? response.data : [];

  return projectData.map((item: any) => ({
    id: item.id,
    documentId: item.documentId,
    name: item.name,
    short_description: item.short_description || '',
    city: item.city,
    place: item.place,
    description: item.description,
    first_image: item.first_image,
    second_image: item.second_image,
    google_map_embed: item.google_map_embed,
  }));
}

export async function fetchProjectByDocumentId(
  documentId: string,
  locale?: string
): Promise<Project | null> {
  const params: Record<string, string> = { populate: '*' };
  if (locale) {
    params.locale = locale;
  }

  try {
    const response = await fetchApi<StrapiListResponse>('/api/projects', params);
    const item = response.data?.find((p: any) => p.documentId === documentId);
    if (!item) return null;

    return {
      id: item.id,
      documentId: item.documentId,
      name: item.name,
      short_description: item.short_description || '',
      city: item.city,
      place: item.place,
      description: item.description,
      first_image: item.first_image,
      second_image: item.second_image,
      google_map_embed: item.google_map_embed,
    };
  } catch (error) {
    console.error('Error fetching project:', error);
    return null;
  }
}

export function getProjectImageUrl(imagePath: string | null | undefined): string {
  if (!imagePath) {
    return 'https://proxy.extractcss.dev/https://framerusercontent.com/images/rfYNgbnQgBOihPRT6UaLPi82u0.jpg?scale-down-to=1024';
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