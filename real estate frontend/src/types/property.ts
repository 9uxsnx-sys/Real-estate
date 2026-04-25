export interface Property {
  id: string;
  documentId: string;
  name: string;
  area: string;
  city: string;
  price: number;
  property_type: 'studio' | 'f1' | 'f2' | 'f3' | 'f4' | 'f5+' | 'garage';
  space_sqm: number;
  beds: number;
  baths: number;
  image: string;
  property_code: string;
  project?: {
    id: number;
    documentId: string;
    name: string;
  };
}

export interface PropertyFeature {
  id: string;
  name: string;
}

export interface PropertyAmenity {
  id: string;
  name: string;
}

export interface PropertyGalleryImage {
  id: string;
  url: string;
  caption?: string;
}

export interface PropertyDetail extends Property {
  description?: string;
  features?: PropertyFeature[];
  amenities?: PropertyAmenity[];
  gallery?: PropertyGalleryImage[];
  map_location?: {
    lat: number;
    lng: number;
    address: string;
  };
  whatsappNumber?: string;
}

export interface StrapiResponse<T> {
  data: T | T[] | null;
  meta: {
    pagination?: {
      page: number;
      pageSize: number;
      pageCount: number;
      total: number;
    };
  };
}

export interface StrapiPropertyResponse {
  data: {
    id: number;
    documentId: string;
    attributes: Property;
  };
  meta: any;
}
