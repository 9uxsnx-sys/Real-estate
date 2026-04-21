# Dynamic Elements Breakdown

This document outlines the dynamic elements for each page of the VistaHaven Real Estate frontend and the required Strapi backend data models.

---

## Multi-Language (i18n) Instructions

### Static Content (UI)
- Handled by **react-i18n** 
- Files: `src/i18n/locales/en.json`, `fr.json`, `ar.json`
- Labels: buttons, headings, placeholders, filter options

### Dynamic Content (Database)
- Handled by **Strapi i18n plugin**
- Each text field can be localized per language

### Implementation Steps

1. **Enable i18n in Strapi**: Install and enable the i18n plugin
2. **Mark fields as localizable**: When creating Content Types, enable i18n for text fields
3. **Create content per language**: Add content for each language (EN, FR, AR)
4. **Frontend API calls**: Pass locale parameter:
   ```
   /api/properties?locale=en
   /api/properties?locale=fr
   /api/properties?locale=ar
   ```

### Fields That Should Be Localizable

| Content Type | Localizable Fields |
|--------------|-------------------|
| **Property** | name, description, features |
| **Project** | name, description, short_description, features, custom_sections |

---

## 1. Properties Listing Page

### 1.1 Main Data: Properties List

| Field | Type | Required | Strapi Field | Notes |
|-------|------|----------|--------------|-------|
| `id` | string | Yes | `id` | Unique identifier (auto-generated) |
| `name` | string | Yes | `name` | Property name |
| `projectName` | string | Yes | `project` | Relation to Project |
| `area` | string | Yes | `area` | e.g., "Alger Centre" |
| `city` | string | Yes | `city` | e.g., "Algiers" |
| `price` | number | Yes | `price` | Price in DZD |
| `propertyCategory` | enum | Yes | `property_category` | Property category |
| `propertyType` | enum | Yes | `property_type` | studio, f1, f2, f3, f4, f5+, garage |
| `spaceSqm` | number | Yes | `space_sqm` | Size in m² |
| `beds` | number | Yes | `beds` | Bedrooms count |
| `baths` | number | Yes | `baths` | Bathrooms count |
| `image` | media | Yes | `image` | Main property image |

**Total: 11 fields per property**

---

### 1.2 Filter Options

| Filter | Type | Data Source | API Behavior |
|--------|------|------------|-------------|
| **Search Query** | Text | User input | Searches: name, area, city (contains) |
| **Sort By** | Dropdown | Hardcoded | price-low, price-high, newest |
| **Property Type** | Dropdown | Enum | Filter by propertyType (exact match) |
| **Project** | Dropdown | API | Unique projectNames from properties |
| **Min Space** | Number | User input | Filter by spaceSqm >= |
| **Max Space** | Number | User input | Filter by spaceSqm <= |

---

### 1.3 Sort Options (Hardcoded)

| Value | Label | Behavior |
|-------|-------|----------|
| `price-low` | Price: Low to High | Sort by price ASC |
| `price-high` | Price: High to Low | Sort by price DESC |
| `newest` | Newest | Sort by createdAt DESC |

---

### 1.4 Property Type Enum

| Value | Label |
|-------|-------|
| `studio` | Studio |
| `f1` | F1 |
| `f2` | F2 |
| `f3` | F3 |
| `f4` | F4 |
| `f5+` | F5+ |
| `garage` | Garage |

---

### 1.5 API Endpoints Required

| Endpoint | Method | Purpose |
|----------|--------|---------|
| `/api/properties` | GET | List all properties with filters |
| `/api/properties?filters[propertyType][$eq]=f2` | GET | Filter by type |
| `/api/properties?filters[project][name][$eq]=Marina Bay` | GET | Filter by project |
| `/api/properties?sort[0][price]:asc` | GET | Sort by price |

---

### 1.6 Strapi Content-Type

**Collection: Property**

| Field | Type | Validations |
|-------|------|------------|
| `name` | Text | Required, min 2 chars |
| `project` | Relation (1-to-many with Project) | Required |
| `area` | Text | Required |
| `city` | Text | Required |
| `price` | Number | Required, min 0 |
| `property_category` | Enumeration | Required |
| `property_type` | Enumeration | Required, values above |
| `space_sqm` | Number | Required, min 0 |
| `beds` | Number | Required, min 0 |
| `baths` | Number | Required, min 0 |
| `image` | Media (single) | Required, image only |

---

## 2. Property Detail Page

### 2.1 Gallery Section

| Phase | Field | Type | Usage |
|-------|-------|------|-------|
| Phase 1: Main Image | `image` | Media (single) | Property card cover + Large gallery on detail page |
| Phase 2: Gallery | `gallery` | Media (array, unlimited) | Remaining gallery images on detail page |

### 2.2 Property Info

| Field | Type | Required | Notes |
|-------|------|----------|-------|
| `price` | number | Yes | Price in DZD |
| `propertyCategory` | enum | Yes | Property category |
| `beds` | number | Yes | Bedrooms count |
| `baths` | number | Yes | Bathrooms count |

### 2.3 Description

| Field | Type | Required | Notes |
|-------|------|----------|-------|
| `description` | Rich Text | Yes | Editable property description |

### 2.4 Features

| Field | Type | Required | Notes |
|-------|------|----------|-------|
| `features` | Component (repeatable) | No | Dynamic list - add/remove unlimited points |
| `features[].name` | Text | Yes | Feature text |

### 2.5 Property Code

| Field | Type | Required | Notes |
|-------|------|----------|-------|
| `propertyCode` | string | Yes | Unique property code (e.g., VH-001) |

### 2.6 Location

- Location is handled in **Project Detail Page**
- Properties pull location from their connected Project

---

### 2.7 API Endpoints Required

| Endpoint | Method | Purpose |
|----------|--------|---------|
| `/api/properties/:id` | GET | Get single property details |
| `/api/properties/:id?populate=gallery` | GET | Get property with gallery images |

---

### 2.8 Strapi Content-Type (Updated)

**Collection: Property**

| Field | Type | Validations |
|-------|------|------------|
| `name` | Text | Required |
| `project` | Relation (1-to-many with Project) | Required |
| `area` | Text | Required |
| `city` | Text | Required |
| `price` | Number | Required, min 0 |
| `property_type` | Enumeration | Required |
| `property_category` | Enumeration | Required |
| `space_sqm` | Number | Required, min 0 |
| `beds` | Number | Required, min 0 |
| `baths` | Number | Required, min 0 |
| `image` | Media (single) | Required |
| `gallery` | Media (multiple) | Optional |
| `description` | Rich Text | Optional |
| `features` | Component (repeatable) | Optional |
| `property_code` | Text | Required, unique |

**Component: PropertyFeature**

| Field | Type | Validations |
|-------|------|------------|
| `name` | Text | Required |

---

---

## 3. Projects Page

### 3.1 Project Section Layout (60/40 Split)

Each project section has two parts:
- **60%**: Large image (Second Main Image)
- **40%**: Project info card with First Main Image + Small description

### 3.2 Fields per Project

| Field | Type | Required | Usage |
|-------|------|----------|-------|
| `firstImage` | Media (single) | Yes | Project info card cover (40% section) |
| `secondImage` | Media (single) | Yes | Large 60% section image |
| `name` | Text | Yes | Project name |
| `shortDescription` | Text | Yes | Small description (max 2 sentences) |

---

### 3.3 API Endpoints Required

| Endpoint | Method | Purpose |
|----------|--------|---------|
| `/api/projects` | GET | List all projects |
| `/api/projects/:id` | GET | Get single project |

---

### 3.4 Strapi Content-Type

**Collection: Project**

| Field | Type | Validations |
|-------|------|------------|
| `name` | Text | Required |
| `first_image` | Media (single) | Required |
| `second_image` | Media (single) | Required |
| `short_description` | Text | Required, max 200 chars |

---

---

## 4. Project Detail Page

### 4.1 Gallery Section

| Phase | Field | Type | Usage |
|-------|-------|------|-------|
| Large Image | `firstImage` | Media (single) | First Main Image (from project info card) |
| Gallery | `gallery` | Media (array, unlimited) | Remaining gallery images |

### 4.2 Title

| Field | Type | Required | Notes |
|-------|------|----------|-------|
| `name` | Text | Yes | Project title |

### 4.3 Location

| Field | Type | Required | Notes |
|-------|------|----------|-------|
| `city` | Text | Yes | e.g., "Algiers" |
| `place` | Text | Yes | e.g., "Alger Centre" |

### 4.4 Description

| Field | Type | Required | Notes |
|-------|------|----------|-------|
| `description` | Rich Text | Yes | Project description |

### 4.5 Features

| Field | Type | Required | Notes |
|-------|------|----------|-------|
| `features` | Component (repeatable) | No | Dynamic list - add/remove unlimited |
| `features[].name` | Text | Yes | Feature text |

### 4.6 Custom Project Sections (Deployable)

| Field | Type | Required | Notes |
|-------|------|----------|-------|
| `customSections` | Component (repeatable, dynamic) | No | Add unlimited sections |

**Custom Section Fields (each can be optional):**

| Field | Type | Notes |
|-------|------|-------|
| `title` | Text | Section title (optional) |
| `gallery` | Media (array) | Gallery images (optional) |
| `description` | Rich Text | Description (optional) |
| `features` | Component | Features list (optional) |

**Deploy Logic:**
- Any combination of fields allowed
- Order matters - each new section appears after previous
- Unlimited sections can be added
- All custom sections appear AFTER Features section, BEFORE Google Maps

### 4.7 Google Maps Embed

| Field | Type | Required | Notes |
|-------|------|----------|-------|
| `googleMapEmbed` | Text | Google Maps embed code/URL |

### 4.8 Properties in This Project

| Field | Type | Notes |
|-------|------|-------|
| Linked Properties | Relation | Shows 3 properties connected to this project |

---

### 4.9 API Endpoints Required

| Endpoint | Method | Purpose |
|----------|--------|---------|
| `/api/projects/:id?populate=*` | GET | Get project with all fields |
| `/api/projects/:id?populate=properties` | GET | Get project with linked properties |

---

### 4.10 Strapi Content-Type (Updated)

**Collection: Project**

| Field | Type | Validations |
|-------|------|------------|
| `name` | Text | Required |
| `first_image` | Media (single) | Required |
| `second_image` | Media (single) | Required |
| `short_description` | Text | Required, max 200 chars |
| `city` | Text | Required |
| `place` | Text | Required |
| `description` | Rich Text | Optional |
| `features` | Component (repeatable) | Optional |
| `custom_sections` | Component (repeatable, dynamic) | Optional |
| `google_map_embed` | Text | Optional |

**Component: ProjectFeature**

| Field | Type | Validations |
|-------|------|------------|
| `name` | Text | Required |

**Component: CustomProjectSection (Dynamic)**

| Field | Type | Validations |
|-------|------|------------|
| `title` | Text | Optional |
| `gallery` | Media (multiple) | Optional |
| `description` | Rich Text | Optional |
| `features` | Component (repeatable) | Optional |

---