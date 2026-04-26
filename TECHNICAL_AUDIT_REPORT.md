# Technical Audit Report: Data Architecture Mapping

**Document Version:** 1.0  
**Generated:** April 2026  
**Purpose:** Deep-dive mapping of backend field logic to frontend implementation

---

## Executive Summary

This document provides a comprehensive technical audit of the data architecture, mapping Strapi backend collections to their frontend implementations. The system consists of two primary collections (Property and Project) with a bidirectional relationship, supported by reusable components for features and custom sections.

---

## Table of Contents

1. [Property Collection](#1-property-collection)
2. [Project Collection](#2-project-collection)
3. [Reusable Components](#3-reusable-components)
4. [Dependency Map & Relations](#4-dependency-map--relations)
5. [Component Composition](#5-component-composition)
6. [Filtering Logic](#6-filtering-logic)

---

## 1. Property Collection

**Collection Type:** `api::property.property`  
**Display Name:** Property  
**Description:** Real estate properties  
**Options:** Draft and Publish enabled, i18n localized

### 1.1 Field-Level Logic

| Field Name | Type | Required | Private | Frontend Purpose | Validation Rules |
|------------|------|----------|---------|------------------|------------------|
| `name` | String | Yes | No | Displays as property title in Property Card, Property Detail page, and search results | i18n localized, max length: 200 |
| `area` | String | Yes | No | Shows location context in Property Card (displayed with city), used in Property Location component | - |
| `city` | String | Yes | No | Secondary location display, used in filtering and location metadata | - |
| `price` | Decimal | Yes | No | Displays formatted price in Property Card, Price Range Filter, Property Detail | Min: 0, Required |
| `property_type` | Enumeration | Yes | No | Used for Property Type filter dropdown, displays property type badge in cards | Enum: studio, f1, f2, f3, f4, f5+, garage |
| `space_sqm` | Decimal | Yes | No | Shows square meter area in Property Card specs, used in Space Filter | Min: 0, Required |
| `beds` | Integer | Yes | No | Displays bedroom count in Property Card specs section | Min: 0, Required |
| `baths` | Integer | Yes | No | Displays bathroom count in Property Card specs section | Min: 0, Required |
| `image` | Media (single) | Yes | No | Main property thumbnail in Property Card grid, Property Detail hero | Allowed types: images |
| `gallery` | Media (multiple) | No | No | Image gallery in Property Detail page, Gallery Modal | Allowed types: images |
| `description` | RichText | No | No | Full property description in Property Detail page | i18n localized |
| `features` | Component (repeatable) | No | No | Property amenities list in PropertyFeatures component | i18n localized, component: property.property-feature |
| `property_code` | String | Yes | No | Unique identifier, used in URL slugs and property lookup | Unique, Required |

### 1.2 Relation Field

| Field Name | Type | Target | Relation Type |
|------------|------|--------|--------------|
| `project` | Relation | `api::project.project` | manyToOne (Property belongs to Project) |

---

## 2. Project Collection

**Collection Type:** `api::project.project`  
**Display Name:** Project  
**Description:** Real estate projects  
**Options:** Draft and Publish enabled, i18n localized

### 2.1 Field-Level Logic

| Field Name | Type | Required | Private | Frontend Purpose | Validation Rules |
|------------|------|----------|---------|------------------|------------------|
| `name` | String | Yes | No | Project title in Projects listing, Project detail page, breadcrumbs | i18n localized |
| `first_image` | Media (single) | Yes | No | Hero image in Project Card, Project detail header | Allowed types: images |
| `second_image` | Media (single) | Yes | No | Secondary image in Project Card hover state, gallery | Allowed types: images |
| `short_description` | Text | Yes | No | Summary in Project Card, project list previews | i18n localized, maxLength: 200 |
| `city` | String | Yes | No | Project location in Project Card, used in city filtering | - |
| `place` | String | Yes | No | Precise location address in Project Detail | - |
| `description` | RichText | No | No | Full project description in Project Detail page | i18n localized |
| `features` | Component (repeatable) | No | No | Project amenities list | i18n localized, component: project.feature |
| `custom_sections` | Component (repeatable) | No | No | Dynamic content sections in Project Detail page | i18n localized, component: project.custom-project-section |
| `google_map` | Text | No | No | Google Maps embed URL in Project Detail location section | - |

### 2.2 Relation Field

| Field Name | Type | Target | Relation Type |
|------------|------|--------|--------------|
| `properties` | Relation | `api::property.property` | oneToMany (Project owns multiple Properties) |

---

## 3. Reusable Components

### 3.1 Property Feature Component

**Component ID:** `property.property-feature`

| Field Name | Type | Required | Frontend Purpose |
|------------|------|----------|------------------|
| `name` | String | Yes | Individual amenity label displayed in PropertyFeatures component |

**Usage:** Used in Property Detail page to list property amenities (e.g., "Pool", "Gym", "Parking").

---

### 3.2 Project Feature Component

**Component ID:** `project.feature`

| Field Name | Type | Required | Frontend Purpose |
|------------|------|----------|------------------|
| `name` | String | Yes | Project amenity label |

**Usage:** Used both as standalone `features` in Project Detail and nested within `custom_sections`.

---

### 3.3 Custom Project Section Component

**Component ID:** `project.custom-project-section`

| Field Name | Type | Required | Frontend Purpose |
|------------|------|----------|------------------|
| `title` | String | No | Section heading in Project Detail |
| `gallery` | Media (multiple) | No | Section-specific images |
| `description` | RichText | No | Section content text |
| `features` | Component (repeatable) | No | Nested project features |

**Usage:** Allows custom content blocks in Project Detail (e.g., "Amenities", "Floor Plans", "Payment Plan").

---

## 4. Dependency Map & Relations

### 4.1 Relation Type: Many-to-One (Property → Project)

```
Property (many) → 1 (one) Project
```

**Connection Logic:**
- Every Property must belong to exactly one Project
- A Project can have zero to many Properties associated with it
- The `project` field in Property stores a reference to the parent Project

**Database Implementation:**
- Property table contains foreign key `project_id` referencing Project
- Project is the "owning" side of the relationship

### 4.2 Relation Type: One-to-Many (Project → Property)

```
Project (one) → (many) Property
```

**Connection Logic:**
- A Project owns multiple Properties via the `properties` relation
- Inverse of the Property → Project relationship
- When querying Project, Strapi can populate all associated Properties

**Database Implementation:**
- Uses inverse relation defined in Project schema (`mappedBy: "project"`)

---

## 5. Component Composition

### 5.1 Property Card Component (`src/components/property/PropertyCard.tsx`)

**Purpose:** Displays property summary in grid and list views

| Nested Field | Source Backend Field | UI Role |
|-------------|---------------------|----------|
| `image` | Property.image | Hero image in card thumbnail |
| `name` | Property.name | Card title |
| `project.name` | Property.project.name | Subtitle showing parent project |
| `area`, `city` | Property.area, Property.city | Location display |
| `property_type` | Property.property_type | Property type badge |
| `space_sqm` | Property.space_sqm | Area display (formatted as "X m²") |
| `beds` | Property.beds | Bedroom count |
| `baths` | Property.baths | Bathroom count |
| `price` | Property.price | Price display (formatted with locale) |

### 5.2 Properties Listing Page (`src/pages/PropertiesListing.tsx`)

**Purpose:** Main listing page with filtering and sorting

| Logic | Source | Description |
|-------|--------|-------------|
| Filter by search | `name` field | Full-text search using Strapi `$containsi` |
| Filter by property type | `property_type` field | Dropdown filter using `$eq` |
| Filter by project | `project.name` → `area` mapping | Maps project names to areas |
| Filter by min/max space | `space_sqm` field | Range filter using `$gte`/`$lte` |
| Sort by price | `price` field | Ascending/descending |
| Sort by newest | `createdAt` field | Descending order |

### 5.3 Project Detail Components

| Component | Purpose | Key Fields Used |
|-----------|---------|------------------|
| `ProjectSection` | Displays custom sections | custom_sections (title, gallery, description, features) |
| `ProjectContactSidebar` | Contact form CTA | Project contact info |
| `PropertyLocation` | Map display | google_map embed |

---

## 6. Filtering Logic

### 6.1 Frontend Query Flow

```
User Action → React Hook (useProperties) → API Service (fetchProperties) → Strapi Query
```

**API Query Parameters:**

| Frontend Filter | Strapi Filter | Query Operator |
|----------------|---------------|---------------|
| `search` | `name` | `$containsi` (case-insensitive contains) |
| `propertyType` | `property_type` | `$eq` (exact match) |
| `projectName` | `area` | `$eq` (mapped via project-to-area lookup) |
| `minSpace` | `space_sqm` | `$gte` (greater than or equal) |
| `maxSpace` | `space_sqm` | `$lte` (less than or equal) |
| `sortBy: price-low` | `price` | `price:asc` |
| `sortBy: price-high` | `price` | `price:desc` |
| `sortBy: newest` | `createdAt` | `createdAt:desc` |

### 6.2 Project-Area Mapping Logic

The frontend maintains a hardcoded mapping for filtering properties by project:

```javascript
const projectToAreaMap = {
  'Marina Bay': 'Dubai Marina',
  'Downtown Views': 'Downtown Dubai',
  'Palm Residences': 'Palm Jumeirah',
  'Garden Heights': 'Jumeirah Golf Estates',
};
```

**Why This Exists:** The backend relation uses `project` (foreign key), but the frontend filter UI uses project names as filter criteria. The API resolves this by mapping project names to the `area` field, which acts as the join key.

### 6.3 Filtering Sequence

When a user clicks "Project A" on the frontend:

1. Frontend receives `projectName: "Project A"`
2. Maps to area via lookup table → `"Dubai Marina"`
3. Sends API query: `filters[area][$eq]: "Dubai Marina"`
4. Strapi returns all Properties where `area = "Dubai Marina"`
5. These properties implicitly belong to Project A (same area = same project)

**Note:** This is an indirect filtering approach. The ideal implementation would filter directly by `project.id` or `project.documentId`.

---

## 7. API Endpoints

| Endpoint | Method | Purpose |
|----------|--------|---------|
| `/api/properties` | GET | List all properties with filters |
| `/api/properties` | GET (by documentId) | Single property detail |
| `/api/projects` | GET | List all projects |
| `/api/projects` | GET (by documentId) | Project detail with populated properties |

---

## 8. Data Flow Diagrams

### 8.1 Property Creation Flow

```
CMS Admin → Property Collection (Strapi)
         ↓
    Validation (required fields)
         ↓
    Published State
         ↓
Frontend ← API Response ← Strapi Query
```

### 8.2 Property Viewing Flow

```
User visits PropertiesListing
         ↓
useProperties hook + filters
         ↓
fetchProperties (API service)
         ↓
Strapi API /api/properties?populate=*
         ↓
Property Card Component (mapped fields)
         ↓
Rendered UI
```

---

## 9. Key Observations & Recommendations

### 9.1 Current Architecture Strengths

- **Bidirectional Relations:** Property ↔ Project relations are properly defined
- **i18n Support:** All text fields are localized for multi-language
- **Draft/Publish:** Content workflow supports drafts
- **Media Handling:** Separate main image and gallery image fields
- **Validation:** Required fields and unique constraints enforced

### 9.2 Areas for Improvement

1. **Project-Area Mapping:** The current project filtering uses area as a proxy key. Consider adding direct `project` relation filtering in the API service.

2. **Missing Fields:** The frontend types reference `features` and `amenities` as separate arrays, but backend only has `features` component. Verify if `amenities` should be a separate field.

3. **Location Data:** No dedicated `map_location` field with lat/lng coordinates exists in backend. The frontend type includes `map_location?: { lat, lng, address }` but it's not in the schema.

4. **WhatsApp Number:** Frontend expects `whatsappNumber` field not present in backend schema.

---

## 10. Appendix: TypeScript Interfaces

### Backend Generated Types (from contentTypes.d.ts)

```typescript
// Property Type
interface ApiPropertyProperty {
  attributes: {
    name: string;           // Required, i18n
    area: string;           // Required
    city: string;            // Required
    price: number;          // Required, min: 0
    property_type: Enumeration;  // Required (studio|f1|f2|f3|f4|f5+|garage)
    space_sqm: number;      // Required, min: 0
    beds: number;            // Required, min: 0
    baths: number;           // Required, min: 0
    image: Media;           // Required
    gallery: Media;         // Multiple
    description: RichText;  // i18n
    features: Component;    // property.property-feature (repeatable)
    property_code: string;  // Required, Unique
    project: Relation;      // manyToOne -> Project
  }
}

// Project Type
interface ApiProjectProject {
  attributes: {
    name: string;           // Required, i18n
    first_image: Media;     // Required
    second_image: Media;    // Required
    short_description: Text; // Required, i18n, maxLength: 200
    city: string;           // Required
    place: string;          // Required
    description: RichText;   // i18n
    features: Component;     // project.feature (repeatable)
    custom_sections: Component; // project.custom-project-section (repeatable)
    google_map: Text;
    properties: Relation;    // oneToMany -> Property
  }
}
```

---

**End of Technical Audit Report**

*This document provides a complete field-level mapping independent of any specific backend software, serving as a blueprint for frontend development and CMS content management.*