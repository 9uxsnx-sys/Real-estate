# VISTA HAVEN — FULL FRAPPE IMPLEMENTATION PLAN

## Overview
This document defines the complete backend + integration plan for the Vista Haven Real Estate system.

---

## Key Decisions
- Properties must be linked to a Project (mandatory)
- Only active properties are shown on the website
- Project location is the single source of truth (properties inherit it)
- Multilingual fields use JSON (EN / FR / AR)
- Contact info is global (Settings)
- Projects are created manually
- Project sections are manually created
- If a project has no active properties → hide "project properties" section on frontend

---

## Architecture

### DocTypes

#### Property
- property_code (unique, manual)
- title (JSON)
- project (Link → Project)
- price
- property_type
- space_sqm
- beds
- baths
- primary_image
- featured
- is_active

Child Tables:
- gallery (images)
- features (icon + JSON text)
- amenities (JSON text)

---

#### Project
- project_name (JSON)
- slug (unique)
- location (JSON)
- description (JSON)
- primary_image
- is_active

Child Tables:
- gallery
- sections (title, description, images, features)

---

#### Settings (Singleton)
- brand_name
- phone
- whatsapp

---

## Workspaces

### Dashboard
- stats (properties, projects)

### Properties
- list + filters
- create/edit

### Projects
- list + create/edit

### Media
- file manager

### Settings
- global info

---

## API Layer

### get_properties
- returns listing format
- filters:
  - search (name + location)
  - project
  - property_type
  - space range
  - sorting

---

### get_property
- returns full detail
- inherits location from project

---

### get_projects
- aggregated:
  - property count
  - price range
  - types

---

### get_project
- returns:
  - project info
  - sections
  - 3 active properties
- if no active properties → return empty list

---

## Multilingual System

Fields stored as JSON:
{
  "en": "...",
  "fr": "...",
  "ar": "..."
}

Backend selects language:
- based on API param (?lang=)

Fallback:
- default to EN

---

## Business Logic

- Property must have project
- Property visibility controlled by is_active
- Project location used everywhere
- Property code is unique
- Contact always from Settings

---

## Image Handling

- Stored in Frappe File Manager
- Returned as URLs

---

## Implementation Phases

### Phase 1: Setup
- Create app
- Create DocTypes

### Phase 2: Structure
- Add child tables
- Add validations

### Phase 3: APIs
- Build endpoints
- Implement filters

### Phase 4: Integration
- Connect React
- Replace mock data

### Phase 5: Testing
- Test filters
- Test language
- Test navigation

---

## Final Result
- Full dynamic website
- Clean admin UI
- Multilingual support
- Scalable system
