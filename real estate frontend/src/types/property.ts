export interface Property {
  id: string;
  name: string;
  projectName: string;
  location: string;
  price: number;
  category: 'For Sale' | 'For Rent' | 'For Investment' | 'Luxury';
  propertyType: 'studio' | 'f1' | 'f2' | 'f3' | 'f4' | 'f5+' | 'garage';
  spaceSqm: number;
  beds: number;
  baths: number;
  sqft: number;
  image: string;
  featured?: boolean;
}

// Future Frappe child table structure for features
export interface PropertyFeature {
  name: string;
  feature_name: string;
  icon: string;
}

// Future Frappe child table structure for amenities
export interface PropertyAmenity {
  name: string;
  amenity_name: string;
}

// Future Frappe child table structure for gallery
export interface PropertyGalleryImage {
  name: string;
  image: string;
  caption?: string;
}

// Extended property with all sections (for future Frappe integration)
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
  propertyCode?: string;
  whatsappNumber?: string;
}
