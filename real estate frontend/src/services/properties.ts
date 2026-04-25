import { fetchApi, API_URL } from './api';
import type { Property } from '../types';
import qs from 'qs';

console.log('[API] Using API_URL:', API_URL);

export interface PropertyFilters {
  search?: string;
  propertyType?: string;
  projectName?: string;
  minSpace?: number;
  maxSpace?: number;
  sortBy?: 'price-low' | 'price-high' | 'newest' | 'featured';
}

function buildQueryParams(filters: PropertyFilters, locale?: string) {
  const queryObj: any = {};

  if (locale) {
    queryObj.locale = locale;
  }

  if (filters.search) {
    queryObj.filters = {
      ...queryObj.filters,
      name: { $containsi: filters.search }
    };
  }

  if (filters.propertyType) {
    queryObj.filters = {
      ...queryObj.filters,
      property_type: { $eq: filters.propertyType }
    };
  }

  if (filters.projectName) {
    const projectToAreaMap: Record<string, string> = {
      'Marina Bay': 'Dubai Marina',
      'Downtown Views': 'Downtown Dubai',
      'Palm Residences': 'Palm Jumeirah',
      'Garden Heights': 'Jumeirah Golf Estates',
    };
    const mappedArea = projectToAreaMap[filters.projectName];
    if (mappedArea) {
      queryObj.filters = {
        ...queryObj.filters,
        area: { $eq: mappedArea }
      };
    }
  }

  if (filters.minSpace) {
    queryObj.filters = {
      ...queryObj.filters,
      space_sqm: { $gte: filters.minSpace }
    };
  }

  if (filters.maxSpace) {
    queryObj.filters = {
      ...queryObj.filters,
      space_sqm: { ...queryObj.filters?.space_sqm, $lte: filters.maxSpace }
    };
  }

  if (filters.sortBy) {
    switch (filters.sortBy) {
      case 'price-low':
        queryObj.sort = ['price:asc'];
        break;
      case 'price-high':
        queryObj.sort = ['price:desc'];
        break;
      case 'newest':
        queryObj.sort = ['createdAt:desc'];
        break;
    }
  }

  queryObj.populate = '*';

  const queryString = qs.stringify(queryObj, { encodeValuesOnly: true });
  console.log('[API] Query string:', queryString);
  return queryString;
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