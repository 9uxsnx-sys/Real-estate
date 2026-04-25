# VistaHaven Real Estate Platform

A full-stack real estate platform built with React (frontend) and Strapi v5 (backend). Features multi-language support, property listings, project showcases, and dynamic content management.

---

## 📁 Project Structure

```
dev-test/
├── real-estate-backend/     # Strapi v5 CMS Backend
├── real-estate frontend/   # React + Vite Frontend
└── DYNAMIC_BREAKDOWN.md   # Data model specifications
```

---

## 🛠️ Tech Stack

### Backend
- **Strapi v5.43.0** - Headless CMS
- **SQLite** - Database (for development)
- **React Admin Panel** - Content management UI
- **i18n Plugin** - Multi-language support

### Frontend
- **React 18** - UI Library
- **Vite** - Build tool
- **TypeScript** - Type safety
- **react-i18n** - Internationalization
- **GSAP** - Animations

---

## 🚀 Quick Start

### Prerequisites
- Node.js 20.x LTS (or 24.x with fixes - see Issues section)
- npm 6+
- Git

### 1. Backend Setup

```bash
cd real-estate-backend

# Install dependencies
npm install

# Build the admin panel
npm run build

# Start development server
npm run develop
```

- **Admin Panel:** http://localhost:1337/admin
- **API:** http://localhost:1337/api/projects

### 2. Frontend Setup

```bash
cd "real estate frontend"

# Install dependencies (already done)
npm install

# Start development server
npm run dev
```

- **Frontend:** http://localhost:5173

---

## 📡 API Endpoints

### Current Endpoints (Backend)

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/projects` | List all projects |
| GET | `/api/projects/:id` | Get single project |
| POST | `/api/projects` | Create project (public) |
| PUT | `/api/projects/:id` | Update project |
| DELETE | `/api/projects/:id` | Delete project |

### Example Usage

```bash
# Get all projects
curl http://localhost:1337/api/projects

# Filter by name
curl "http://localhost:1337/api/projects?filters[name][$eq]=Marina Bay"

# With locale support
curl http://localhost:1337/api/projects?locale=en
```

---

## 📊 Data Models

### Project Collection Type

**Content Type:** `Project`

| Field | Type | Localizable | Required |
|-------|------|-------------|----------|
| name | Text | Yes | Yes |
| first_image | Media | - | Yes |
| second_image | Media | - | Yes |
| short_description | Text | Yes | Yes |
| city | Text | No | Yes |
| place | Text | No | Yes |
| description | Rich Text | Yes | No |
| features | Component (repeatable) | Yes | No |
| custom_sections | Component (repeatable) | Yes | No |
| google_map | Text | No | No |

### Components

1. **project-feature**
   - name (Text, required)

2. **custom-project-section**
   - title (Text)
   - gallery (Media, multiple)
   - description (Rich Text)
   - features (Component, repeatable)

---

## 🔧 Development Guide

### Adding New Projects

1. Start the Strapi server: `npm run develop`
2. Open http://localhost:1337/admin
3. Login with admin credentials
4. Go to Content Manager → Projects
5. Create new entry with:
   - Name, description, city, place
   - Upload images (first_image, second_image)
   - Add features (add component entries)
   - Add custom_sections

### Creating Property Content Type (Next Step)

Reference `DYNAMIC_BREAKDOWN.md` for field requirements:

```
Property Fields Needed:
- name (localizable)
- project (relation → Project)
- area, city, price
- property_type (enum: studio, f1, f2, f3, f4, f5+, garage)
- property_category (enum)
- space_sqm, beds, baths
- image, gallery
- description (localizable)
- features (component)
- property_code (unique)
```

---

## 🐛 Issues & Solutions

### 1. PowerShell Execution Policy
**Error:** Scripts disabled on system
**Solution:**
```powershell
powershell -ExecutionPolicy Bypass -Command "your-command"
```

### 2. better-sqlite3 Not Loading (Node.js 24.x)
**Error:** `Could not locate the bindings file`
**Solution:**
```bash
npm rebuild better-sqlite3
```

### 3. Blank Admin Page
**Solution:**
```bash
npm run build
npm run develop
# Wait 15+ seconds before opening browser
```

### 4. Google Maps Plugin
**Note:** `@amicaldo/strapi-google-maps` requires Strapi v4. Not compatible with v5.
**Workaround:** Use text field for embed code (already implemented).

---

## 📋 What's Completed

### ✅ Backend
- [x] Strapi v5.43.0 installation
- [x] Project content type with all fields
- [x] Components (project-feature, custom-project-section)
- [x] i18n enabled for localizable fields
- [x] 4 sample projects (basic data)
- [x] Development server running

### ⚠️ Remaining (Backend)
- [ ] Add images to projects (via admin panel)
- [ ] Add features/custom_sections (via admin panel)
- [ ] Create Property content type
- [ ] Add sample properties

### ⏳ Frontend
- [ ] Connect to Strapi API (currently uses static data)
- [ ] Implement property listing filters
- [ ] Property detail page integration

---

## 📁 File Documentation

### Backend (`real-estate-backend/`)

| File/Folder | Description |
|-------------|-------------|
| `src/api/project/` | Project API routes, controllers, services |
| `src/components/project/` | Reusable components |
| `src/components/project/feature.json` | Feature component schema |
| `src/components/project/custom-project-section.json` | Section component schema |
| `.env` | Environment variables |
| `SETUP_GUIDE.md` | Original setup instructions |
| `DEVELOPMENT_REPORT.md` | Detailed development history |

### Frontend (`real estate frontend/`)

| File/Folder | Description |
|-------------|-------------|
| `src/pages/` | Page components (Projects, Properties, etc.) |
| `src/components/` | Reusable UI components |
| `src/data/` | Static data (properties.ts, projects.ts) |
| `src/i18n/` | Internationalization files |
| `public/assets/images/` | Property images |

---

## 🤝 Contributing

To continue development:

1. **Backend Development:**
   - Reference `DYNAMIC_BREAKDOWN.md` for data requirements
   - Use admin panel for complex fields (components, media)
   - Rebuild after schema changes: `npm run build`

2. **Frontend Development:**
   - Update API calls in `src/utils/` to fetch from Strapi
   - Modify `src/data/properties.ts` to use API responses

---

## 📄 Reference Documentation

- **DYNAMIC_BREAKDOWN.md** - Complete data model specifications
- **DEVELOPMENT_REPORT.md** - Backend development history with troubleshooting
- **SETUP_GUIDE.md** - Original backend setup guide

---

## 🔗 Links

- **Backend Admin:** http://localhost:1337/admin
- **Frontend Dev:** http://localhost:5173
- **API:** http://localhost:1337/api

---

## 📝 License

MIT License

---

**Last Updated:** April 25, 2026
**Version:** 0.1.0
**Strapi Version:** 5.43.0
**Node.js:** v24.15.0 (with fixes)