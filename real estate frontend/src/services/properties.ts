import { fetchApi, API_URL } from './api';
import type { Property } from '../types';

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

export async function fetchProperties(
  filters: PropertyFilters = {},
  locale?: string
): Promise<Property[]> {
  const params = buildQueryParams(filters, locale);
  const response = await fetchApi<StrapiListResponse>('/api/properties', params);

  const propertyData = Array.isArray(response.data) ? response.data : [];

  return propertyData.map((item: any) => ({
    id: String(item.id),
    documentId: item.documentId,
    name: item.name,
    area: item.area,
    city: item.city,
    price: item.price,
    property_type: item.property_type,
    space_sqm: item.space_sqm,
    beds: item.beds,
    baths: item.baths,
    image: item.image,
    property_code: item.property_code,
    project: item.project,
  }));
}

export async function fetchPropertyByDocumentId(
  documentId: string,
  locale?: string
): Promise<Property | null> {
  const params: Record<string, string> = {};
  if (locale) {
    params.locale = locale;
  }
  params['populate'] = '*';

  try {
    const response = await fetchApi<StrapiListResponse>('/api/properties', params);
    const item = response.data?.find((p: any) => p.documentId === documentId);
    if (!item) return null;

    return {
      id: String(item.id),
      documentId: item.documentId,
      name: item.name,
      area: item.area,
      city: item.city,
      price: item.price,
      property_type: item.property_type,
      space_sqm: item.space_sqm,
      beds: item.beds,
      baths: item.baths,
      image: item.image,
      property_code: item.property_code,
      project: item.project,
    };
  } catch (error) {
    console.error('Error fetching property:', error);
    return null;
  }
}

export function getImageUrl(imagePath: string | null | undefined): string {
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