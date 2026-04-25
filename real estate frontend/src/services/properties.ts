import { fetchApi, fetchApiById, API_URL } from './api';
import type { Property, StrapiPropertyResponse, StrapiResponse } from '../types';

export interface PropertyFilters {
  search?: string;
  propertyType?: string;
  projectName?: string;
  minSpace?: number;
  maxSpace?: number;
  sortBy?: 'price-low' | 'price-high' | 'newest' | 'featured';
}

function buildQueryParams(filters: PropertyFilters, locale?: string) {
  const params: Record<string, string> = {};

  if (locale) {
    params.locale = locale;
  }

  if (filters.search) {
    params['filters[name][$containsi]'] = filters.search;
  }

  if (filters.propertyType) {
    params['filters[property_type][$eq]'] = filters.propertyType;
  }

  if (filters.projectName) {
    params['filters[project][name][$eq]'] = filters.projectName;
  }

  if (filters.minSpace) {
    params['filters[space_sqm][$gte]'] = String(filters.minSpace);
  }

  if (filters.maxSpace) {
    params['filters[space_sqm][$lte]'] = String(filters.maxSpace);
  }

  switch (filters.sortBy) {
    case 'price-low':
      params.sort = 'price:asc';
      break;
    case 'price-high':
      params.sort = 'price:desc';
      break;
    case 'newest':
      params.sort = 'createdAt:desc';
      break;
    default:
      break;
  }

  params['populate'] = '*';

  return params;
}

export async function fetchProperties(
  filters: PropertyFilters = {},
  locale?: string
): Promise<StrapiResponse<Property[]>> {
  const params = buildQueryParams(filters, locale);
  return fetchApi<StrapiResponse<Property[]>>('/api/properties', params);
}

export async function fetchPropertyById(
  id: string,
  locale?: string
): Promise<StrapiPropertyResponse | null> {
  try {
    const params: Record<string, string> = { populate: '*' };
    if (locale) {
      params.locale = locale;
    }
    return await fetchApiById<StrapiPropertyResponse>('/api/properties', id);
  } catch (error) {
    console.error('Error fetching property:', error);
    return null;
  }
}

export async function fetchPropertyByDocumentId(
  documentId: string,
  locale?: string
): Promise<StrapiPropertyResponse | null> {
  try {
    const params: Record<string, string> = { populate: '*' };
    if (locale) {
      params.locale = locale;
    }
    return await fetchApiById<StrapiPropertyResponse>(
      `/api/properties`,
      documentId
    );
  } catch (error) {
    console.error('Error fetching property:', error);
    return null;
  }
}

export function getImageUrl(imagePath: string | null | undefined): string {
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

export function formatPropertyForDisplay(property: any): Property {
  return {
    id: String(property.id),
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
    project: property.project
      ? {
          id: property.project.id,
          documentId: property.project.documentId,
          name: property.project.name,
        }
      : undefined,
  };
}