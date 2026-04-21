# 🏗️ FRAPPE BACKEND ENGINEERING SPECIFICATION
## VistaHaven Real Estate Platform

**Document Version:** 1.0  
**Date:** April 2026  
**Prepared For:** Frappe Backend Developer  
**Frontend Status:** Complete (React + TypeScript + GSAP + Tailwind CSS)  
**Target:** Production-Ready Custom Frappe Application

---

# TABLE OF CONTENTS

1. [Executive Summary](#1-executive-summary)
2. [System Architecture Overview](#2-system-architecture-overview)
3. [Complete DocType Specifications](#3-complete-doctype-specifications)
4. [API Endpoints Specification](#4-api-endpoints-specification)
5. [Business Logic & Computation Rules](#5-business-logic--computation-rules)
6. [Data Migration Requirements](#6-data-migration-requirements)
7. [Multi-Language & RTL Strategy](#7-multi-language--rtl-strategy)
8. [Image & File Management](#8-image--file-management)
9. [Security & Permissions Model](#9-security--permissions-model)
10. [Performance & Scalability Requirements](#10-performance--scalability-requirements)
11. [Implementation Phases](#11-implementation-phases)
12. [Testing Requirements](#12-testing-requirements)
13. [Deployment & DevOps](#13-deployment--devops)
14. [Appendix: Complete Data Samples](#14-appendix-complete-data-samples)

---

# 1. EXECUTIVE SUMMARY

## 1.1 Project Overview

VistaHaven is a **premium real estate property listing platform** currently built as a static frontend application with 15 hardcoded properties. The goal is to build a **scalable Frappe backend** that transforms this into a fully dynamic, content-managed platform.

## 1.2 Current Frontend Stack

| Technology | Version | Purpose |
|---|---|---|
| React | 18.3.1 | UI Framework |
| TypeScript | 5.x | Type Safety |
| React Router DOM | 7.14.0 | Client-Side Routing |
| i18next | 26.0.3 | Multi-Language Support (EN, FR, AR) |
| GSAP | 3.12.5 | Professional Animations |
| Tailwind CSS | 4.1.12 | Styling |
| Vite | 6.3.5 | Build Tool |

## 1.3 What Needs to Be Built

**3 Custom DocTypes** with full CRUD capabilities:
1. **Real Estate Property** - Individual property listings
2. **Real Estate Project** - Property development projects
3. **Real Estate Settings** - Global configuration (Singleton)

**5 REST API Endpoints** for frontend consumption:
1. `get_properties` - Filtered, sorted, paginated property list
2. `get_property` - Single property detail
3. `get_projects` - Aggregated project listing
4. `get_project` - Single project detail with linked properties
5. `get_filters` - Dynamic filter options

**Data Migration** of 15 existing properties into the database.

---

# 2. SYSTEM ARCHITECTURE OVERVIEW

## 2.1 High-Level Architecture

```
┌─────────────────────────────────────────────────────────┐
│                    FRONTEND (Complete)                   │
│  React 18 + TypeScript + GSAP + Tailwind CSS + Vite     │
│  - Language-prefixed routing (/:lang/*)                  │
│  - i18n: EN, FR, AR (RTL support)                        │
│  - GSAP animations (ScrollTrigger, custom cursor)        │
│  - Touch gestures (swipe, pinch-zoom gallery)            │
└────────────────────────┬────────────────────────────────┘
                         │
                         │ REST API Calls (JSON)
                         │ All endpoints: allow_guest=True
                         │
┌────────────────────────▼────────────────────────────────┐
│              FRAPPE BACKEND (To Build)                   │
│                                                          │
│  ┌──────────────────────────────────────────────┐       │
│  │          API Layer (Python)                   │       │
│  │  @frappe.whitelist(allow_guest=True)          │       │
│  │  - get_properties()                           │       │
│  │  - get_property()                             │       │
│  │  - get_projects()                             │       │
│  │  - get_project()                              │       │
│  │  - get_filters()                              │       │
│  └──────────────────────────────────────────────┘       │
│                                                          │
│  ┌──────────────────────────────────────────────┐       │
│  │        DocTypes (Database Models)             │       │
│  │  - Real Estate Property                       │       │
│  │  - Real Estate Project                        │       │
│  │  - Real Estate Settings (Singleton)           │       │
│  └──────────────────────────────────────────────┘       │
│                                                          │
│  ┌──────────────────────────────────────────────┐       │
│  │        Child Tables                           │       │
│  │  - Property Features                          │       │
│  │  - Property Gallery                           │       │
│  │  - Project Unit Types                         │       │
│  │  - Project Gallery                            │       │
│  └──────────────────────────────────────────────┘       │
│                                                          │
│  ┌──────────────────────────────────────────────┐       │
│  │        Frappe Desk (Admin UI)                 │       │
│  │  - Property Management Forms                  │       │
│  │  - Project Management Forms                   │       │
│  │  - Global Settings                            │       │
│  │  - Bulk Import/Export                         │       │
│  └──────────────────────────────────────────────┘       │
└────────────────────────┬────────────────────────────────┘
                         │
                         │ MariaDB / PostgreSQL
                         │
┌────────────────────────▼────────────────────────────────┐
│                    DATABASE                              │
│  - tabReal Estate Property                               │
│  - tabReal Estate Project                                │
│  - tabReal Estate Settings                               │
│  - Child table tables                                    │
│  - File storage (images)                                 │
└──────────────────────────────────────────────────────────┘
```

## 2.2 Routing Structure (Frontend)

```
/                              → Redirects to /en
/:lang/                        → PropertiesListing (Home)
/:lang/property/:id            → PropertyDetail
/:lang/projects                → Projects Listing
/:lang/projects/:projectId     → ProjectDetail
```

**Important:** The `:lang` parameter is always the first path segment. Supported values: `en`, `fr`, `ar`.

## 2.3 Data Flow Architecture

```
User Action (Frontend)
    ↓
React Component
    ↓
API Call (fetch('/api/method/vista_estate.api...'))
    ↓
Frappe @whitelist Method
    ↓
Database Query (frappe.get_all / frappe.get_doc)
    ↓
Transform Data (map fields to frontend expectations)
    ↓
Return JSON Response
    ↓
Frontend Renders UI
```

---

# 3. COMPLETE DOCTYPE SPECIFICATIONS

## 3.1 DOCTYPE: Real Estate Property

**Module:** Real Estate  
**Naming:** Auto-generate using pattern `PROP-.#####` (e.g., PROP-00001)  
**Is Submittable:** No  
**Is Single:** No  
**Allow Import/Export:** Yes  
**Track Changes:** Yes  

### 3.1.1 Main Fields

| # | Fieldname | Label | Type | Options | Req | Description |
|---|---|---|---|---|---|---|
| 1 | `property_name` | Property Name | Data | - | ✓ | Display name (e.g., "The One", "Ocean View Villa") |
| 2 | `project` | Project | Link | → Real Estate Project | ✓ | Parent project this property belongs to |
| 3 | `location` | Location | Data | - | ✓ | Human-readable location (e.g., "Bel Air, LA") |
| 4 | `price` | Price | Currency | - | ✓ | Price in USD. Store as decimal, display without decimals |
| 5 | `currency` | Currency | Select | USD, EUR, GBP, AED | - | Default: USD. For future multi-currency support |
| 6 | `category` | Category | Select | For Sale, For Rent, For Investment, Luxury | ✓ | Property category for filtering |
| 7 | `property_type` | Property Type | Select | studio, f1, f2, f3, f4, f5+, garage | ✓ | Unit type identifier |
| 8 | `space_sqm` | Area (sqm) | Float | - | ✓ | Total area in square meters |
| 9 | `beds` | Bedrooms | Int | - | ✓ | Number of bedrooms (0 for garage) |
| 10 | `baths` | Bathrooms | Int | - | ✓ | Number of bathrooms (0 for garage) |
| 11 | `sqft` | Area (sqft) | Int | - | ✓ | Total area in square feet |
| 12 | `primary_image` | Primary Image | Attach Image | - | ✓ | Main thumbnail/hero image |
| 13 | `featured` | Featured | Check | - | - | Boolean: featured properties sort first |
| 14 | `description` | Description | Text Editor | - | - | Rich HTML property description |
| 15 | `property_code` | Property Code | Data | - | Auto | Auto-generated: `VH-{id zero-padded to 3 digits}` |
| 16 | `whatsapp_number` | WhatsApp Number | Data | - | - | Property-specific WhatsApp contact |
| 17 | `map_lat` | Latitude | Float | - | - | Google Maps latitude coordinate |
| 18 | `map_lng` | Longitude | Float | - | - | Google Maps longitude coordinate |
| 19 | `map_address` | Map Address | Data | - | - | Formatted address for map display |
| 20 | `status` | Status | Select | Available, Sold, Reserved, Under Contract | - | Default: Available |
| 21 | `created_by_owner` | Created By | Link | → User | Auto | Auto-populated from session |

### 3.1.2 Child Table: Property Feature

**Table Fieldname:** `features`  
**Options:** Property Feature

| # | Fieldname | Label | Type | Req | Description |
|---|---|---|---|---|---|
| 1 | `icon` | Icon | Select | home, tree, car, trending-up, sparkles, bed, bath, ruler, location | ✓ | Lucide React icon identifier |
| 2 | `feature_name` | Feature | Data | ✓ | Feature description text |

### 3.1.3 Child Table: Property Amenity

**Table Fieldname:** `amenities`  
**Options:** Property Amenity

| # | Fieldname | Label | Type | Req | Description |
|---|---|---|---|---|---|
| 1 | `amenity_name` | Amenity | Data | ✓ | Amenity name (e.g., "Swimming Pool", "Gym") |

### 3.1.4 Child Table: Property Gallery Image

**Table Fieldname:** `gallery`  
**Options:** Property Gallery Image

| # | Fieldname | Label | Type | Req | Description |
|---|---|---|---|---|---|
| 1 | `image` | Image | Attach Image | ✓ | Gallery image file |
| 2 | `caption` | Caption | Data | - | Optional image caption |

### 3.1.5 Field Groups (for Desk UI)

```
Group 1: Basic Information
  - property_name
  - project
  - location
  - category
  - property_type
  - status

Group 2: Pricing
  - price
  - currency

Group 3: Specifications
  - space_sqm
  - beds
  - baths
  - sqft

Group 4: Media
  - primary_image
  - featured

Group 5: Details
  - description
  - features (child table)
  - amenities (child table)
  - gallery (child table)

Group 6: Location & Contact
  - map_lat
  - map_lng
  - map_address
  - whatsapp_number
  - property_code (Read Only)
```

### 3.1.6 Server-Side Scripting (Python)

**Before Save Hook:**
```python
def before_save(doc, method):
    # Auto-generate property code
    if not doc.property_code:
        # Count total properties
        count = frappe.db.count("Real Estate Property")
        doc.property_code = f"VH-{str(count + 1).zfill(3)}"
    
    # Auto-set created_by_owner on first save
    if doc.is_new():
        doc.created_by_owner = frappe.session.user
```

---

## 3.2 DOCTYPE: Real Estate Project

**Module:** Real Estate  
**Naming:** By `project_name` field (user-defined, URL-safe slug recommended)  
**Is Submittable:** No  
**Is Single:** No  
**Allow Import/Export:** Yes  

### 3.2.1 Main Fields

| # | Fieldname | Label | Type | Req | Description |
|---|---|---|---|---|---|
| 1 | `project_name` | Project Name | Data | ✓ | Display name (e.g., "Bel Air Heights") |
| 2 | `location` | Location | Data | ✓ | Project location (e.g., "Bel Air, LA") |
| 3 | `description` | Description | Text Editor | - | Rich HTML project overview |
| 4 | `primary_image` | Primary Image | Attach Image | ✓ | Hero/cover image |
| 5 | `map_lat` | Latitude | Float | - | Google Maps latitude |
| 6 | `map_lng` | Longitude | Float | - | Google Maps longitude |
| 7 | `map_address` | Map Address | Data | - | Formatted address |
| 8 | `whatsapp_number` | WhatsApp Number | Data | - | Project-specific WhatsApp |
| 9 | `status` | Status | Select | Active, Upcoming, Completed, Sold Out | - | Default: Active |

### 3.2.2 Child Table: Project Unit Type

**Table Fieldname:** `unit_types`  
**Options:** Project Unit Type

| # | Fieldname | Label | Type | Req | Description |
|---|---|---|---|---|---|
| 1 | `unit_type_name` | Unit Type Name | Data | ✓ | Display name (e.g., "Studio Units", "First Floor - F1") |
| 2 | `unit_type_slug` | Slug | Data | ✓ | URL-safe identifier (e.g., "studio", "f1") |
| 3 | `description` | Description | Text | - | Unit type description |
| 4 | `features` | Features | Table | - | Nested child: Project Unit Type Feature |

**Nested Child Table: Project Unit Type Feature**  
**Table Fieldname:** `features` (under unit_types)  
**Options:** Project Unit Type Feature

| # | Fieldname | Label | Type | Req | Description |
|---|---|---|---|---|---|
| 1 | `feature_text` | Feature | Data | ✓ | Feature description bullet point |

### 3.2.3 Child Table: Project Gallery Image

**Table Fieldname:** `gallery`  
**Options:** Project Gallery Image

| # | Fieldname | Label | Type | Req | Description |
|---|---|---|---|---|---|
| 1 | `image` | Image | Attach Image | ✓ | Gallery image |
| 2 | `caption` | Caption | Data | - | Optional caption |

### 3.2.4 Field Groups (for Desk UI)

```
Group 1: Project Information
  - project_name
  - location
  - status

Group 2: Description & Media
  - description
  - primary_image
  - unit_types (child table)
  - gallery (child table)

Group 3: Location & Contact
  - map_lat
  - map_lng
  - map_address
  - whatsapp_number
```

---

## 3.3 DOCTYPE: Real Estate Settings (Singleton)

**Module:** Real Estate  
**Is Single:** Yes  
**Allow Copy:** No  

| # | Fieldname | Label | Type | Default | Description |
|---|---|---|---|---|---|
| 1 | `brand_name` | Brand Name | Data | VistaHaven | Website brand name displayed in header |
| 2 | `brand_logo` | Brand Logo | Attach Image | - | Logo image URL |
| 3 | `default_whatsapp_number` | Default WhatsApp | Data | - | Global WhatsApp number (fallback) |
| 4 | `default_phone_number` | Default Phone | Data | - | Global phone number |
| 5 | `default_currency` | Default Currency | Select | USD | Default currency for new properties |
| 6 | `default_map_lat` | Default Latitude | Float | 34.100222 | Default map center latitude |
| 7 | `default_map_lng` | Default Longitude | Float | -118.450709 | Default map center longitude |
| 8 | `default_map_address` | Default Address | Data | Bel Air, Los Angeles, CA | Default map address |
| 9 | `properties_per_page` | Properties Per Page | Int | 8 | Default pagination limit |
| 10 | `show_featured_first` | Show Featured First | Check | ✓ | Sorting behavior |

---

# 4. API ENDPOINTS SPECIFICATION

## 4.1 File Structure

```
vista_estate/
├── api/
│   ├── __init__.py
│   ├── properties.py
│   └── projects.py
├── fixtures/
│   └── initial_data.json
└── ...
```

## 4.2 Endpoint: get_properties

**File:** `vista_estate/api/properties.py`

```python
import frappe
from frappe import _

@frappe.whitelist(allow_guest=True)
def get_properties(search=None, project=None, property_type=None,
                   min_space=None, max_space=None, sort_by="featured",
                   page=1, limit=8):
    """
    Get filtered, sorted, and paginated list of properties.
    
    Args:
        search (str): Search in property name AND location (case-insensitive partial match)
        project (str): Exact match on project name
        property_type (str): Exact match on property_type enum
        min_space (int): Minimum space_sqm (inclusive)
        max_space (int): Maximum space_sqm (inclusive)
        sort_by (str): One of: featured, price-low, price-high, newest
        page (int): Page number (1-indexed)
        limit (int): Items per page
    
    Returns:
        dict: { properties: [], total: int, page: int, limit: int, hasMore: bool }
    """
```

**Implementation:**
```python
    # Build filters
    filters = {"status": "Available"}  # Only show available properties
    
    if search:
        filters["or_filters"] = [
            ["property_name", "like", f"%{search}%"],
            ["location", "like", f"%{search}%"]
        ]
    
    if project:
        filters["project"] = project
    
    if property_type:
        filters["property_type"] = property_type
    
    if min_space:
        filters["space_sqm"] = [">=", float(min_space)]
    
    if max_space:
        filters["space_sqm"] = ["<=", float(max_space)]
    
    # Build order
    order_by_map = {
        "featured": "featured desc, creation desc",
        "price-low": "price asc",
        "price-high": "price desc",
        "newest": "creation desc"
    }
    order_by = order_by_map.get(sort_by, "featured desc, creation desc")
    
    # Pagination
    page = int(page)
    limit = int(limit)
    start = (page - 1) * limit
    
    # Fetch one extra to determine hasMore
    fetch_limit = limit + 1
    
    properties = frappe.get_all(
        "Real Estate Property",
        filters=filters if "or_filters" not in filters else _build_or_filters(filters),
        fields=[
            "name as id",
            "property_name as name",
            "project as projectName",
            "location",
            "price",
            "category",
            "property_type as propertyType",
            "space_sqm as spaceSqm",
            "beds",
            "baths",
            "sqft",
            "primary_image as image",
            "featured"
        ],
        order_by=order_by,
        start=start,
        limit_page_length=fetch_limit
    )
    
    # Determine hasMore
    has_more = len(properties) > limit
    if has_more:
        properties = properties[:limit]
    
    # Get total count
    total = frappe.db.count("Real Estate Property", filters=_clean_filters(filters))
    
    return {
        "properties": properties,
        "total": total,
        "page": page,
        "limit": limit,
        "hasMore": has_more
    }

def _build_or_filters(filters):
    """Helper to handle OR filters properly."""
    or_filters = filters.pop("or_filters", None)
    if or_filters:
        return filters, or_filters
    return filters, None

def _clean_filters(filters):
    """Remove or_filters for db.count."""
    clean = {k: v for k, v in filters.items() if k != "or_filters"}
    return clean
```

**Example Request:**
```
GET /api/method/vista_estate.api.properties.get_properties?search=bel+air&sort_by=price-low&page=1&limit=8
```

**Example Response:**
```json
{
  "message": {
    "properties": [
      {
        "id": "PROP-00001",
        "name": "The One",
        "projectName": "Bel Air Heights",
        "location": "Bel Air, LA",
        "price": 690000,
        "category": "For Investment",
        "propertyType": "f5+",
        "spaceSqm": 258,
        "beds": 6,
        "baths": 4,
        "sqft": 2780,
        "image": "https://storage.googleapis.com/...",
        "featured": true
      }
    ],
    "total": 15,
    "page": 1,
    "limit": 8,
    "hasMore": true
  }
}
```

---

## 4.3 Endpoint: get_property

**File:** `vista_estate/api/properties.py`

```python
@frappe.whitelist(allow_guest=True)
def get_property(id):
    """
    Get complete property details including all child tables.
    
    Args:
        id (str): Property ID (name field)
    
    Returns:
        dict: Complete property object with features, gallery, amenities
    """
    doc = frappe.get_doc("Real Estate Property", id)
    
    if not doc:
        frappe.throw(_("Property not found"))
    
    # Build response matching frontend expectations
    return {
        "id": doc.name,
        "name": doc.property_name,
        "projectName": doc.project,
        "location": doc.location,
        "price": doc.price,
        "category": doc.category,
        "propertyType": doc.property_type,
        "spaceSqm": doc.space_sqm,
        "beds": doc.beds,
        "baths": doc.baths,
        "sqft": doc.sqft,
        "image": doc.primary_image,
        "featured": doc.featured,
        "description": doc.description,
        "features": [
            {
                "name": f.feature_name,
                "feature_name": f.feature_name,
                "icon": f.icon
            }
            for f in doc.features
        ],
        "amenities": [a.amenity_name for a in doc.amenities],
        "gallery": [g.image for g in doc.gallery],
        "propertyCode": doc.property_code,
        "whatsappNumber": doc.whatsapp_number or frappe.get_single("Real Estate Settings").default_whatsapp_number,
        "map_location": {
            "lat": doc.map_lat or frappe.get_single("Real Estate Settings").default_map_lat,
            "lng": doc.map_lng or frappe.get_single("Real Estate Settings").default_map_lng,
            "address": doc.map_address or frappe.get_single("Real Estate Settings").default_map_address
        }
    }
```

**Example Request:**
```
GET /api/method/vista_estate.api.properties.get_property?id=PROP-00001
```

---

## 4.4 Endpoint: get_projects

**File:** `vista_estate/api/projects.py`

```python
@frappe.whitelist(allow_guest=True)
def get_projects():
    """
    Get all projects with aggregated data from linked properties.
    
    Returns:
        dict: { projects: [] }
    """
    projects = frappe.get_all("Real Estate Project", 
        filters={"status": "Active"},
        fields=["name", "project_name", "location", "primary_image"],
        order_by="creation desc"
    )
    
    result = []
    for proj in projects:
        # Get linked properties
        properties = frappe.get_all("Real Estate Property",
            filters={"project": proj.name, "status": "Available"},
            fields=["price", "property_type"]
        )
        
        # Aggregate data
        property_count = len(properties)
        prices = [p.price for p in properties if p.price]
        types = list(set([p.property_type for p in properties if p.property_type]))
        
        result.append({
            "id": proj.name,
            "name": proj.project_name,
            "location": proj.location,
            "image": proj.primary_image,
            "propertyCount": property_count,
            "priceRange": {
                "min": min(prices) if prices else 0,
                "max": max(prices) if prices else 0
            },
            "types": types
        })
    
    return {"projects": result}
```

---

## 4.5 Endpoint: get_project

**File:** `vista_estate/api/projects.py`

```python
@frappe.whitelist(allow_guest=True)
def get_project(projectId):
    """
    Get single project detail with linked properties.
    
    Args:
        projectId (str): Project name/ID
    
    Returns:
        dict: { project: {}, properties: [] }
    """
    doc = frappe.get_doc("Real Estate Project", projectId)
    
    if not doc:
        frappe.throw(_("Project not found"))
    
    # Get linked properties
    properties = frappe.get_all("Real Estate Property",
        filters={"project": doc.name, "status": "Available"},
        fields=[
            "name as id",
            "property_name as name",
            "project as projectName",
            "location",
            "price",
            "category",
            "property_type as propertyType",
            "space_sqm as spaceSqm",
            "beds",
            "baths",
            "sqft",
            "primary_image as image",
            "featured"
        ],
        order_by="creation desc",
        limit=3  # Frontend shows up to 3
    )
    
    # Build unit sections
    unit_sections = []
    for ut in doc.unit_types:
        unit_sections.append({
            "id": ut.unit_type_slug,
            "title": ut.unit_type_name,
            "images": [img.image for img in doc.gallery[:4]],  # Use project gallery
            "description": ut.description,
            "features": [f.feature_text for f in ut.features]
        })
    
    return {
        "project": {
            "id": doc.name,
            "name": doc.project_name,
            "location": doc.location,
            "description": doc.description,
            "images": [g.image for g in doc.gallery],
            "whatsappNumber": doc.whatsapp_number or frappe.get_single("Real Estate Settings").default_whatsapp_number,
            "map_location": {
                "lat": doc.map_lat or frappe.get_single("Real Estate Settings").default_map_lat,
                "lng": doc.map_lng or frappe.get_single("Real Estate Settings").default_map_lng,
                "address": doc.map_address or frappe.get_single("Real Estate Settings").default_map_address
            }
        },
        "unit_sections": unit_sections,
        "properties": properties
    }
```

---

## 4.6 Endpoint: get_filters

**File:** `vista_estate/api/properties.py`

```python
@frappe.whitelist(allow_guest=True)
def get_filters():
    """
    Get dynamic filter options for the search bar.
    
    Returns:
        dict: { projects: [], propertyTypes: [], categories: [], sortOptions: [] }
    """
    # Get unique projects with active properties
    projects = frappe.db.sql("""
        SELECT DISTINCT p.project 
        FROM `tabReal Estate Property` p
        WHERE p.status = 'Available' AND p.project IS NOT NULL
        ORDER BY p.project
    """, as_dict=True)
    
    return {
        "projects": [p.project for p in projects],
        "propertyTypes": ["studio", "f1", "f2", "f3", "f4", "f5+", "garage"],
        "categories": ["For Sale", "For Rent", "For Investment", "Luxury"],
        "sortOptions": [
            {"value": "featured", "label": "Featured"},
            {"value": "price-low", "label": "Price: Low to High"},
            {"value": "price-high", "label": "Price: High to Low"},
            {"value": "newest", "label": "Newest First"}
        ]
    }
```

---

# 5. BUSINESS LOGIC & COMPUTATION RULES

## 5.1 Property Code Auto-Generation

**Format:** `VH-XXX` where XXX is zero-padded sequential number.

**Examples:**
- 1st property → `VH-001`
- 42nd property → `VH-042`
- 150th property → `VH-150`

**Implementation:** Count existing properties, add 1, zero-pad to 3 digits.

## 5.2 Price Formatting

**Storage:** Decimal in database (e.g., `690000.00`)  
**Display:** Integer USD with commas (e.g., `$690,000`)

**Frontend Formatting:**
```javascript
Intl.NumberFormat('en-US', {
  style: 'currency',
  currency: 'USD',
  maximumFractionDigits: 0
}).format(price)
```

**Backend Note:** Always return price as number, not string. Frontend handles formatting.

## 5.3 Property Type Label Mapping

| Database Value | Display Label |
|---|---|
| studio | Studio |
| f1 | F1 |
| f2 | F2 |
| f3 | F3 |
| f4 | F4 |
| f5+ | F5+ |
| garage | Garage |

**Note:** Keep database values lowercase. Frontend handles display transformation.

## 5.4 Search Logic

**Requirements:**
- Case-insensitive partial match
- Searches across BOTH `property_name` AND `location`
- Uses SQL `LIKE` with wildcards: `%search_term%`

**SQL Equivalent:**
```sql
WHERE property_name LIKE '%bel air%' OR location LIKE '%bel air%'
```

## 5.5 Filter Logic

### Exact Match Filters:
- `project` → exact match on project name
- `property_type` → exact match on enum value

### Range Filters:
- `min_space` → `space_sqm >= value` (inclusive)
- `max_space` → `space_sqm <= value` (inclusive)

**Important:** Invalid numeric values should be silently ignored (not cause errors).

## 5.6 Sorting Logic

| Sort Value | SQL Order By | Description |
|---|---|---|
| featured | `featured DESC, creation DESC` | Featured first, then newest |
| price-low | `price ASC` | Cheapest first |
| price-high | `price DESC` | Most expensive first |
| newest | `creation DESC` | Most recently created first |

## 5.7 Pagination Logic

- Default limit: **8 properties per page**
- Frontend loads 8 more on "Show More" button click
- Backend should fetch `limit + 1` to determine if more results exist
- Response must include `hasMore: boolean`

## 5.8 Project Aggregation Logic

For each project, compute:
```python
property_count = count of properties linked to project
price_range_min = min(price of all linked properties)
price_range_max = max(price of all linked properties)
types = unique list of property_type values from linked properties
```

## 5.9 Default Values Fallback Chain

When a property lacks certain fields, fallback to Real Estate Settings:

```
whatsapp_number:
  1. Property.whatsapp_number
  2. Real Estate Settings.default_whatsapp_number

map_lat:
  1. Property.map_lat
  2. Real Estate Settings.default_map_lat

map_lng:
  1. Property.map_lng
  2. Real Estate Settings.default_map_lng

map_address:
  1. Property.map_address
  2. Real Estate Settings.default_map_address
```

---

# 6. DATA MIGRATION REQUIREMENTS

## 6.1 Current Hardcoded Data

The frontend currently has **15 properties** across **12 unique projects** hardcoded in `src/data/properties.ts`.

## 6.2 Migration Steps

### Step 1: Create Projects
Create 12 Real Estate Project records:

| # | Project Name | Location | Property Count |
|---|---|---|---|
| 1 | Bel Air Heights | Bel Air, LA | 1 |
| 2 | Malibu Shores | Malibu, CA | 1 |
| 3 | Beverly Hills Residences | Beverly Hills, CA | 2 |
| 4 | Hollywood Towers | Hollywood Hills, CA | 1 |
| 5 | Santa Monica Bay | Santa Monica, CA | 2 |
| 6 | LA Central Lofts | Downtown LA, CA | 2 |
| 7 | Pasadena Gardens | Pasadena, CA | 1 |
| 8 | Venice Beach Living | Venice Beach, CA | 1 |
| 9 | Brentwood Estates | Brentwood, CA | 1 |
| 10 | Silver Lake Village | Silver Lake, CA | 1 |
| 11 | Hollywood Heights | Hollywood Hills, CA | 1 |
| 12 | Malibu Beachfront | Malibu, CA | 1 |

### Step 2: Create Properties
Migrate all 15 property records with exact field values (see Appendix 14 for complete data).

### Step 3: Upload Images
- Download all images from external URLs (Firebase Storage, Unsplash)
- Upload to Frappe File Manager
- Update image URLs in property/project records

### Step 4: Verify
- Test all API endpoints return correct data
- Compare API responses with current hardcoded data
- Ensure filters, sorting, and pagination work identically

---

# 7. MULTI-LANGUAGE & RTL STRATEGY

## 7.1 Supported Languages

| Code | Name | Direction |
|---|---|---|
| en | English | LTR |
| fr | French (Français) | LTR |
| ar | Arabic (العربية) | RTL |

## 7.2 Translation Architecture

**Current Approach:** Frontend handles ALL UI translations via i18next JSON files.

**Recommendation:** Keep this approach. Only database-driven content needs Frappe translation.

### What Needs Frappe Translation:
- Property descriptions
- Property feature names
- Project descriptions
- Project unit type descriptions
- Project amenity names

### What Stays on Frontend:
- Navigation labels
- Button text
- Form labels
- Error messages
- Static UI strings

## 7.3 Frappe Translation Implementation

Use Frappe's built-in translation system:
```python
# In API responses, return raw database values
# Frontend will NOT translate these (they're content, not UI)

# If translation is needed:
description = _(doc.description)  # Uses Frappe translation table
```

## 7.4 RTL Handling

**Frontend Responsibility:**
- When `lang === 'ar'`, sets `document.documentElement.dir = 'rtl'`
- CSS handles layout mirroring
- Back button arrow direction flips

**Backend Responsibility:**
- None. RTL is purely a frontend concern.

---

# 8. IMAGE & FILE MANAGEMENT

## 8.1 Image Storage Strategy

### Option A: Frappe File Manager (Recommended for simplicity)
- Upload images via Desk interface
- Frappe stores in `site/public/files/`
- URLs: `/files/filename.jpg`

### Option B: External CDN (Recommended for production scale)
- Use Firebase Storage, Cloudinary, or AWS S3
- Upload via API or manually
- Store full URLs in Frappe records
- Better performance, scalability, and CDN delivery

### Option C: Hybrid
- Use Frappe File Manager for admin convenience
- Configure Frappe to push files to CDN automatically
- Set up CDN URL rewriting in site config

## 8.2 Image Requirements

### Property Images
- **Primary Image:** 1 per property (thumbnail/listing view)
- **Gallery Images:** 3-10 per property (detail view)
- **Recommended Size:** 1920x1080px minimum
- **Format:** JPEG or WebP
- **Max File Size:** 2MB per image

### Project Images
- **Primary Image:** 1 per project (cover image)
- **Gallery Images:** 4-20 per project
- **Recommended Size:** 1920x1080px minimum
- **Format:** JPEG or WebP

## 8.3 Image URL Handling

**Backend should return:**
- Full absolute URLs (including `https://`)
- Not relative paths

**Example:**
```json
{
  "image": "https://storage.googleapis.com/download/storage/v1/b/prd-shared-services.firebasestorage.app/o/h2m-assets%2Ffb4dcf76f877c99402aa9f144703427e9bd68ddd.jpg"
}
```

## 8.4 Image Optimization (Future Enhancement)

Consider implementing:
- Automatic WebP conversion on upload
- Multiple size variants (thumbnail, medium, large, original)
- Lazy loading support
- CDN integration with automatic optimization

---

# 9. SECURITY & PERMISSIONS MODEL

## 9.1 Roles Definition

| Role | Description | Access Level |
|---|---|---|
| Real Estate Manager | Full CRUD access to all doctypes | Complete |
| Real Estate Editor | Create/Edit properties and projects | Partial |
| Real Estate Viewer | View-only access | Read Only |
| Website User | Public API access (guest) | API Only |

## 9.2 DocType Permissions

### Real Estate Property

| Role | Read | Write | Create | Delete | Submit | Cancel |
|---|---|---|---|---|---|---|
| Real Estate Manager | ✓ | ✓ | ✓ | ✓ | - | - |
| Real Estate Editor | ✓ | ✓ | ✓ | - | - | - |
| Real Estate Viewer | ✓ | - | - | - | - | - |
| All (Guest) | ✓ | - | - | - | - | - |

**API Access:** `allow_guest=True` - No authentication required for reading.

### Real Estate Project

| Role | Read | Write | Create | Delete | Submit | Cancel |
|---|---|---|---|---|---|---|
| Real Estate Manager | ✓ | ✓ | ✓ | ✓ | - | - |
| Real Estate Editor | ✓ | ✓ | ✓ | - | - | - |
| Real Estate Viewer | ✓ | - | - | - | - | - |
| All (Guest) | ✓ | - | - | - | - | - |

### Real Estate Settings

| Role | Read | Write | Create | Delete |
|---|---|---|---|---|
| Real Estate Manager | ✓ | ✓ | - | - |
| System Manager | ✓ | ✓ | - | - |

## 9.3 API Security

**Current:** All API endpoints use `allow_guest=True` for public access.

**Future Enhancement (if needed):**
- Add rate limiting to prevent abuse
- Implement API key authentication for write operations
- Add CAPTCHA for contact form submissions
- Log all API requests for audit trail

## 9.4 Data Validation

**Server-Side Validation:**
- Required fields must be validated before save
- Price must be positive number
- Coordinates must be valid lat/lng ranges
- Property type must be valid enum value

**API Input Sanitization:**
- Escape all string inputs
- Validate numeric ranges
- Sanitize HTML in description fields (allow safe tags only)

---

# 10. PERFORMANCE & SCALABILITY REQUIREMENTS

## 10.1 Database Indexing

**Recommended Indexes:**

```sql
-- Properties table
CREATE INDEX idx_property_project ON `tabReal Estate Property`(project);
CREATE INDEX idx_property_type ON `tabReal Estate Property`(property_type);
CREATE INDEX idx_property_category ON `tabReal Estate Property`(category);
CREATE INDEX idx_property_featured ON `tabReal Estate Property`(featured);
CREATE INDEX idx_property_price ON `tabReal Estate Property`(price);
CREATE INDEX idx_property_space ON `tabReal Estate Property`(space_sqm);
CREATE INDEX idx_property_status ON `tabReal Estate Property`(status);

-- Composite indexes for common queries
CREATE INDEX idx_project_status ON `tabReal Estate Property`(project, status);
CREATE INDEX idx_type_status ON `tabReal Estate Property`(property_type, status);
```

## 10.2 Query Optimization

**Best Practices:**
- Use `frappe.get_all()` instead of `frappe.get_list()` for read-only queries (faster)
- Only fetch required fields (don't use `fields=["*"]`)
- Use `limit_page_length` to prevent massive result sets
- Add `order_by` explicitly (don't rely on default)

**Example Optimized Query:**
```python
# GOOD: Specific fields, limited results
properties = frappe.get_all(
    "Real Estate Property",
    filters={"status": "Available"},
    fields=["name", "property_name", "price", "location"],
    order_by="creation desc",
    limit_page_length=100
)

# BAD: All fields, no limit
properties = frappe.get_all("Real Estate Property")
```

## 10.3 Caching Strategy

**Recommended Caching:**

```python
# Cache filter metadata (changes infrequently)
@frappe.whitelist(allow_guest=True)
@frappe.cache(ttl=3600)  # 1 hour cache
def get_filters():
    ...

# Cache project list (changes occasionally)
@frappe.whitelist(allow_guest=True)
@frappe.cache(ttl=1800)  # 30 minute cache
def get_projects():
    ...

# Do NOT cache property listings (frequently changing data)
```

**Cache Invalidation:**
- Clear cache on property/project create, update, delete
- Use `frappe.clear_cache()` or `frappe.cache().delete_key()`

## 10.4 Pagination Best Practices

- Always use cursor-based or offset pagination
- Never return all records in a single response
- Enforce maximum limit (e.g., 100 items per page max)
- Include `total` count for frontend pagination UI
- Include `hasMore` boolean for "Load More" button logic

## 10.5 Expected Scale

**Current:** 15 properties, 12 projects  
**Target Year 1:** 500 properties, 50 projects  
**Target Year 3:** 5000 properties, 200 projects  

**Performance Targets:**
- Property list API: < 200ms response time (with 1000 properties)
- Property detail API: < 100ms response time
- Projects list API: < 100ms response time
- Support 100 concurrent users without degradation

---

# 11. IMPLEMENTATION PHASES

## Phase 1: DocType Creation (Week 1)

**Deliverables:**
- [ ] Create Real Estate Property DocType with all fields
- [ ] Create Property Feature child table
- [ ] Create Property Amenity child table
- [ ] Create Property Gallery Image child table
- [ ] Create Real Estate Project DocType with all fields
- [ ] Create Project Unit Type child table
- [ ] Create Project Unit Type Feature nested child table
- [ ] Create Project Gallery Image child table
- [ ] Create Real Estate Settings Singleton DocType
- [ ] Set up field groups for Desk UI
- [ ] Configure server-side hooks (before_save for property code)
- [ ] Test DocType creation in Desk

## Phase 2: Data Migration (Week 1-2)

**Deliverables:**
- [ ] Export 15 properties from frontend code
- [ ] Create 12 Project records
- [ ] Create 15 Property records with exact field values
- [ ] Download and upload all images to Frappe/CDN
- [ ] Link properties to projects correctly
- [ ] Verify data integrity
- [ ] Create fixture file for version control

## Phase 3: API Development (Week 2-3)

**Deliverables:**
- [ ] Implement `get_properties` endpoint
- [ ] Implement `get_property` endpoint
- [ ] Implement `get_projects` endpoint
- [ ] Implement `get_project` endpoint
- [ ] Implement `get_filters` endpoint
- [ ] Add input validation and error handling
- [ ] Add response formatting to match frontend expectations
- [ ] Test all endpoints with Postman/curl
- [ ] Write API documentation

## Phase 4: Frontend Integration (Week 3-4)

**Deliverables:**
- [ ] Create API service layer in frontend (`src/api/properties.ts`)
- [ ] Replace hardcoded data import with API calls
- [ ] Implement loading states
- [ ] Implement error states
- [ ] Test filtering, sorting, pagination with real API
- [ ] Test property detail page with real API
- [ ] Test projects pages with real API
- [ ] Remove all hardcoded data files
- [ ] Test edge cases (empty results, invalid IDs)

## Phase 5: Content Management Setup (Week 4)

**Deliverables:**
- [ ] Configure Desk forms for easy property CRUD
- [ ] Set up image upload workflows
- [ ] Configure property code auto-generation
- [ ] Set up bulk import/export (CSV/Excel)
- [ ] Create user roles and permissions
- [ ] Train content team on Desk usage
- [ ] Create content entry guidelines document

## Phase 6: Testing & Optimization (Week 5)

**Deliverables:**
- [ ] Performance testing (API response times)
- [ ] Load testing (concurrent users)
- [ ] Database query optimization
- [ ] Add database indexes
- [ ] Implement caching where appropriate
- [ ] Test all filters and sorting combinations
- [ ] Test multi-language support
- [ ] Cross-browser testing
- [ ] Mobile responsiveness testing
- [ ] Fix all bugs

## Phase 7: Deployment & Launch (Week 5-6)

**Deliverables:**
- [ ] Set up production Frappe server
- [ ] Configure domain and SSL
- [ ] Migrate data to production
- [ ] Configure CDN for images
- [ ] Set up monitoring and logging
- [ ] Configure automated backups
- [ ] Create rollback plan
- [ ] Deploy frontend to production
- [ ] Smoke test all features
- [ ] Launch!

---

# 12. TESTING REQUIREMENTS

## 12.1 Unit Tests

**Python (Backend):**
- Test all API endpoints with various parameter combinations
- Test property code auto-generation
- Test project aggregation logic
- Test filter building logic
- Test error handling (invalid IDs, missing fields)

**TypeScript (Frontend):**
- Test API service layer
- Test data transformation functions
- Test price formatting
- Test property type label mapping

## 12.2 Integration Tests

- Test complete user journeys:
  - Browse properties → Apply filters → View details → Contact via WhatsApp
  - Browse projects → View project → See linked properties
  - Search by location → Sort by price → Load more results
- Test API endpoint chains
- Test data consistency between frontend and backend

## 12.3 Performance Tests

- API response time under load (target: < 200ms)
- Database query optimization (EXPLAIN ANALYZE)
- Image loading performance
- Frontend rendering performance
- Memory usage monitoring

## 12.4 User Acceptance Tests

- Content team can create/edit/delete properties via Desk
- Properties appear correctly on frontend
- Filters work as expected
- Multi-language content displays correctly
- Contact forms send correct WhatsApp links
- Image galleries work on mobile (swipe, pinch-zoom)

---

# 13. DEPLOYMENT & DEVOPS

## 13.1 Server Requirements

**Minimum (Development):**
- 2 CPU cores
- 4 GB RAM
- 50 GB SSD storage
- Ubuntu 20.04+ or Debian 11+

**Recommended (Production):**
- 4 CPU cores
- 8 GB RAM
- 100 GB SSD storage
- Ubuntu 22.04 LTS
- Separate database server (optional)

## 13.2 Technology Stack

| Component | Technology | Version |
|---|---|---|
| Framework | Frappe | 15.x (Latest) |
| Database | MariaDB | 10.6+ or PostgreSQL 14+ |
| Cache | Redis | 6.x+ |
| Web Server | Nginx | 1.18+ |
| Process Manager | Supervisor | 4.x |
| Python | Python | 3.10+ |
| Node.js | Node.js | 18.x+ (for frontend build) |

## 13.3 Deployment Steps

```bash
# 1. Install Frappe Bench
bench init frappe-bench
cd frappe-bench

# 2. Create new site
bench new-site vista-haven.local

# 3. Install custom app
bench get-app vista_estate https://github.com/your-org/vista_estate
bench --site vista-haven.local install-app vista_estate

# 4. Migrate data
bench --site vista-haven.local migrate

# 5. Build frontend
bench build

# 6. Start services
bench start
```

## 13.4 Environment Configuration

**site_config.json:**
```json
{
  "db_host": "localhost",
  "db_port": 3306,
  "db_name": "vista_haven",
  "db_password": "secure_password",
  "redis_cache": "redis://localhost:13000",
  "redis_queue": "redis://localhost:11000",
  "developer_mode": false,
  "allow_cors": "https://your-frontend-domain.com"
}
```

## 13.5 Monitoring & Logging

- **Error Tracking:** Sentry integration (built into Frappe)
- **Logs:** Frappe logs (`logs/web.error.log`, `logs/worker.error.log`)
- **Database:** Slow query log enabled
- **Server:** Resource monitoring (CPU, RAM, Disk)
- **Uptime:** Uptime Robot or similar service

## 13.6 Backup Strategy

**Automated Backups:**
```bash
# Daily backup (cron job)
0 2 * * * bench --site vista-haven.local backup --with-files

# Weekly off-site backup (rsync to remote server)
0 3 * * 0 rsync -avz /path/to/backups/ user@backup-server:/backups/
```

**Backup Contents:**
- Database dump
- Public files (images, attachments)
- Private files
- Site configuration

---

# 14. APPENDIX: COMPLETE DATA SAMPLES

## 14.1 Complete Property Data (15 Records)

### Property 1: The One
```json
{
  "id": "1",
  "name": "The One",
  "projectName": "Bel Air Heights",
  "location": "Bel Air, LA",
  "price": 690000,
  "category": "For Investment",
  "propertyType": "f5+",
  "spaceSqm": 258,
  "beds": 6,
  "baths": 4,
  "sqft": 2780,
  "image": "https://storage.googleapis.com/download/storage/v1/b/prd-shared-services.firebasestorage.app/o/h2m-assets%2Ffb4dcf76f877c99402aa9f144703427e9bd68ddd.jpg%3Fscale-down-to=1024",
  "featured": true
}
```

### Property 2: Ocean View Villa
```json
{
  "id": "2",
  "name": "Ocean View Villa",
  "projectName": "Malibu Shores",
  "location": "Malibu, CA",
  "price": 4250000,
  "category": "Luxury",
  "propertyType": "f5+",
  "spaceSqm": 418,
  "beds": 5,
  "baths": 6,
  "sqft": 4500,
  "image": "https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=800",
  "featured": true
}
```

### Properties 3-15 (Summary Table)

| ID | Name | Project | Location | Price | Category | Type | Sqm | Beds | Baths | Sqft | Featured |
|---|---|---|---|---|---|---|---|---|---|---|---|
| 3 | Modern Hills Estate | Beverly Hills Residences | Beverly Hills, CA | 3200000 | For Sale | f4 | 353 | 4 | 5 | 3800 | No |
| 4 | Sunset Boulevard Penthouse | Hollywood Towers | Hollywood Hills, CA | 1850000 | For Sale | f3 | 195 | 3 | 3 | 2100 | No |
| 5 | Coastal Investment Property | Santa Monica Bay | Santa Monica, CA | 850000 | For Investment | f3 | 153 | 3 | 2 | 1650 | No |
| 6 | Downtown Luxury Loft | LA Central Lofts | Downtown LA, CA | 1200000 | Luxury | f2 | 172 | 2 | 2 | 1850 | No |
| 7 | Family Home with Pool | Pasadena Gardens | Pasadena, CA | 950000 | For Sale | f4 | 223 | 4 | 3 | 2400 | No |
| 8 | Investment Opportunity | Venice Beach Living | Venice Beach, CA | 720000 | For Investment | f2 | 130 | 2 | 2 | 1400 | No |
| 9 | Garden Estate | Brentwood Estates | Brentwood, CA | 2800000 | Luxury | f5+ | 334 | 5 | 4 | 3600 | No |
| 10 | Charming Craftsman | Silver Lake Village | Silver Lake, CA | 580000 | For Rent | f1 | 102 | 2 | 1 | 1100 | No |
| 11 | Hillside Contemporary | Hollywood Heights | Hollywood Hills, CA | 2100000 | For Sale | f4 | 297 | 4 | 4 | 3200 | No |
| 12 | Beachfront Condo | Malibu Beachfront | Malibu, CA | 1450000 | For Sale | f2 | 149 | 2 | 2 | 1600 | No |
| 13 | Downtown Studio | LA Central Lofts | Downtown LA, CA | 450000 | For Sale | studio | 45 | 1 | 1 | 484 | No |
| 14 | Garage Unit | Beverly Hills Residences | Beverly Hills, CA | 150000 | For Investment | garage | 25 | 0 | 0 | 269 | No |
| 15 | Modern F1 Apartment | Santa Monica Bay | Santa Monica, CA | 620000 | For Rent | f1 | 65 | 1 | 1 | 700 | No |

## 14.2 Project Aggregation Results

After running `get_projects()`, the expected output:

```json
{
  "projects": [
    {
      "id": "bel-air-heights",
      "name": "Bel Air Heights",
      "location": "Bel Air, LA",
      "image": "https://...",
      "propertyCount": 1,
      "priceRange": { "min": 690000, "max": 690000 },
      "types": ["f5+"]
    },
    {
      "id": "beverly-hills-residences",
      "name": "Beverly Hills Residences",
      "location": "Beverly Hills, CA",
      "image": "https://...",
      "propertyCount": 2,
      "priceRange": { "min": 150000, "max": 3200000 },
      "types": ["f4", "garage"]
    }
    // ... 10 more projects
  ]
}
```

## 14.3 Property Type Distribution

| Type | Count | Percentage |
|---|---|---|
| f5+ | 3 | 20% |
| f4 | 3 | 20% |
| f3 | 2 | 13.3% |
| f2 | 3 | 20% |
| f1 | 2 | 13.3% |
| studio | 1 | 6.7% |
| garage | 1 | 6.7% |

## 14.4 Category Distribution

| Category | Count | Percentage |
|---|---|---|
| For Sale | 7 | 46.7% |
| For Investment | 4 | 26.7% |
| Luxury | 3 | 20% |
| For Rent | 2 | 13.3% |

## 14.5 Price Statistics

| Metric | Value |
|---|---|
| Minimum Price | $150,000 (Garage Unit) |
| Maximum Price | $4,250,000 (Ocean View Villa) |
| Average Price | $1,454,667 |
| Median Price | $950,000 |
| Total Portfolio Value | $21,820,000 |

## 14.6 Space Statistics

| Metric | Value |
|---|---|
| Minimum Space | 25 sqm (Garage Unit) |
| Maximum Space | 418 sqm (Ocean View Villa) |
| Average Space | 195 sqm |

---

# 15. QUICK REFERENCE CHECKLIST

## For the Frappe Developer

### Before Starting:
- [ ] Read this entire document
- [ ] Review frontend codebase structure
- [ ] Understand routing and data flow
- [ ] Review existing hardcoded data

### During Development:
- [ ] Follow DocType specifications exactly
- [ ] Match API response formats exactly
- [ ] Test with Postman after each endpoint
- [ ] Keep frontend compatibility in mind
- [ ] Use proper error handling
- [ ] Add logging for debugging

### Before Delivery:
- [ ] All 5 API endpoints working
- [ ] All 3 DocTypes created and tested
- [ ] 15 properties migrated successfully
- [ ] 12 projects created successfully
- [ ] Images uploaded and linked
- [ ] Permissions configured
- [ ] Performance tested
- [ ] Documentation complete

---

# END OF DOCUMENT

**Document Version:** 1.0  
**Last Updated:** April 2026  
**Maintained By:** VistaHaven Development Team

**Questions or clarifications?** Contact the frontend development team with specific endpoint or field references.
