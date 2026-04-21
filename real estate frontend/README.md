# VistaHaven Real Estate

A modern, responsive real estate property listing website built with React, TypeScript, and Tailwind CSS.

## Overview

VistaHaven is a clean and scalable property listing platform designed to showcase premium real estate properties. The website features property listings, detailed property pages, project showcases, and a modular component architecture.

## Tech Stack

- **Framework:** React 18 with TypeScript
- **Styling:** Tailwind CSS v4
- **Routing:** React Router DOM
- **Animation:** Framer Motion
- **Icons:** Lucide React
- **Fonts:** Geist (custom font family)
- **Build Tool:** Vite

## Features

### Property Listing Page
- **Unified Search Bar:** Location search with integrated filters (sort, property type, project, space range)
- **Responsive Layout:**
  - Mobile: Stacked filter layout with 2-column grid
  - Tablet: 3-row filter layout
  - Desktop: Single row with all controls
- **View Modes:** Toggle between grid (3 columns) and list (2 columns on desktop)
- **Smart Filtering:** Real-time filtering by location, project, property type, and space range
- **Property Cards:** Consistent design with image carousel, badges, specs, and pricing

### Property Detail Page
- **Full-Width Gallery:** Property image showcase
- **Property Specs:** Beds, baths, area, and type display
- **Overview Section:** Detailed property description
- **Features List:** Key property features with icons
- **Location Map:** Integrated map with address
- **Contact Sidebar:** Inquiry form and contact options

### Projects Page
- **Alternating Layout:** 60/40 image/content split sections
- **Project Aggregation:** Groups properties by project name
- **Price Ranges:** Shows min/max prices per project
- **Property Counts:** Displays number of units per project

### Project Detail Page
- **Project-Specific View:** Shows aggregated project information
- **Custom Sections:** Deployable `ProjectSection` components for:
  - Studio units
  - Floor plans (F1, F2, etc.)
  - Garage/parking
  - Any custom section the owner wants to add
- **2x2 Gallery Grid:** Each section has a rectangular (16:9) 4-image gallery
- **Overview & Features:** Each section has description and bullet-point features
- **Properties in This Project:** Section showing up to 3 linked properties with "See More" button
- **Image Gallery Modal:** Full-screen modal with swipe navigation and pinch-to-zoom support

## Project Structure

```
src/
├── components/
│   ├── ScrollToTop.tsx       # Scroll restoration on route change
│   │
│   ├── filters/              # Filter components
│   │   ├── HeroSection.tsx   # Unified search & filter bar
│   │   └── index.ts          # Barrel export
│   │
│   ├── layout/               # Layout components
│   │   ├── Navigation.tsx    # Sticky navigation with logo and CTA
│   │   └── index.ts          # Barrel export
│   │
│   ├── project/              # Project display components
│   │   ├── ProjectAlternatingSection.tsx  # Alternating layout section
│   │   ├── InfoCardComponent.tsx          # Project info card
│   │   ├── LargeImageComponent.tsx        # Large project image
│   │   └── index.ts                       # Barrel export
│   │
│   ├── project-detail/       # Project detail page components
│   │   ├── ProjectSection.tsx             # Reusable custom section component
│   │   └── index.ts                       # Barrel export
│   │
│   ├── property/             # Property display components
│   │   ├── PropertyCard.tsx               # Grid and list view cards
│   │   └── index.ts                       # Barrel export
│   │
│   ├── property-detail/      # Property detail page components
│   │   ├── PropertyContactSidebar.tsx     # Contact form sidebar
│   │   ├── PropertyFeatures.tsx           # Features list
│   │   ├── PropertyGallery.tsx             # Image gallery
│   │   ├── PropertyLocation.tsx            # Map and address
│   │   ├── PropertySpecs.tsx               # Property specifications
│   │   └── index.ts                        # Barrel export
│   │
│   └── ui/                   # Reusable UI components
│       ├── badge.tsx                       # Status badges
│       ├── button.tsx                      # Button component
│       ├── ImageGalleryModal.tsx           # Full-screen image gallery modal
│       └── property-card.tsx               # Property card (shadcn)
│
├── pages/
│   ├── PropertiesListing.tsx              # Main property listing page
│   ├── PropertyDetail.tsx                  # Property detail page
│   ├── Projects.tsx                        # Projects showcase page
│   ├── ProjectDetail.tsx                   # Project detail page
│   └── index.ts                            # Barrel export
│
├── types/                    # TypeScript definitions
│   ├── index.ts                            # Barrel export
│   ├── project.ts                          # Project interfaces
│   └── property.ts                         # Property interfaces
│
├── utils/                    # Helper functions
│   ├── formatters.ts                       # formatPrice, formatDate
│   └── index.ts                            # Barrel export
│
├── data/
│   └── properties.ts                       # Static property data
│
├── styles/
│   └── globals.css                         # Global styles
│
├── App.tsx                   # Main app with routing
├── main.tsx                  # App entry point
└── index.css                 # Tailwind imports
```

## Architecture Philosophy

### Clean Imports with Barrel Exports
All folders have `index.ts` files for clean, consistent imports:
```typescript
// Instead of this:
import { PropertyCard } from '../components/property/PropertyCard';

// We use this:
import { PropertyCard } from '../components/property';
```

### Component Organization
- **Filters:** Search, filter inputs, and filter state management
- **Layout:** Navigation and page structure components
- **Project:** Project display components (alternating sections, cards)
- **Project-Detail:** Custom deployable sections for project pages
- **Property:** Property display components (cards, grids)
- **Property-Detail:** Property page sections (gallery, specs, features, location)
- **UI:** Generic reusable components (Button, Badge, Card)

### Type Safety
All types are centralized in `src/types/`:
- `Property` - Main property interface
- `PropertyType` - Property type enum
- `ProjectSectionData` - Data structure for project sections
- `PropertyDetail` - Extended property with all sections

### Data Flow
1. Properties defined in `data/properties.ts`
2. `PropertiesListing` component manages filter state
3. `HeroSection` receives filter state and callbacks
4. `PropertyCard` receives filtered property data
5. Clicking a card navigates to `/property/:id`
6. Clicking a project navigates to `/projects/:projectId`

## Styling

### Tailwind Configuration
- Custom colors: `rgb(44,44,44)` (text), `rgb(102,252,117)` (accent green)
- Custom font: Geist (300, 400, 600, 700 weights)
- Consistent spacing: 4px base unit
- Max container width: 1360px

### Design Tokens
- **Border radius:** `rounded-2xl` for images, `rounded-full` for buttons/inputs
- **Shadows:** Subtle shadows for card elevation
- **Typography:** Geist font family throughout
- **Colors:** Neutral palette with `rgb(44,44,44)` for text, `rgb(136,136,136)` for secondary text

## Development

### Installation
```bash
npm install
```

### Running Locally
```bash
npm run dev
```
Server runs at `http://localhost:3000/`

### Build for Production
```bash
npm run build
```

### Preview Production Build
```bash
npm run preview
```

## Contributing

This project follows a strict folder structure. When adding new components:
1. Place in appropriate folder
2. Export from folder's `index.ts`
3. Import using barrel export pattern
4. Add types to `src/types/`
5. Add utilities to `src/utils/`
6. Follow existing component patterns

## License

Copyright 2024 VistaHaven. All rights reserved.