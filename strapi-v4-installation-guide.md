# Strapi v4 Fresh Installation - Detailed Instructions

## PREREQUISITES: Node.js 18-20

**IMPORTANT:** You MUST have Node.js version 18, 19, or 20 installed to run Strapi v4.

Check your Node version:
```bash
node --version
```

If you have Node 21+, you need to either:
- Use nvm-windows to switch to Node 18/20
- Or install Node 18/20 separately

---

## Installation Commands

Run these commands in your terminal ( Command Prompt or PowerShell ):

```bash
# Navigate to your projects folder
cd C:\Users\akramba\Downloads\dev-test

# Create new Strapi v4 project
npx create-strapi-app@4 real-estate-backend-v4 --quickstart

# Install dependencies
cd real-estate-backend-v4
npm install qs
```

---

## Phase 2: Create Content Types (EXACT ORDER!)

### 2.1 FIRST: Create "Project" Collection
Go to Content-Type Builder → Create collection type:

**Display Name:** Project  
**API ID:** project

**Add these fields in order:**
| # | Field Name | Type | Required | Other Settings |
|---|------------|------|----------|----------------|
| 1 | name | Short Text | YES | - |
| 2 | short_description | Short Text | YES | Max length: 200 |
| 3 | city | Short Text | YES | - |
| 4 | place | Short Text | YES | - |
| 5 | description | Rich Text | NO | - |
| 6 | google_map | Long Text | NO | - |
| 7 | first_image | Single Media | YES | Allowed types: Images |
| 8 | second_image | Single Media | YES | Allowed types: Images |

**Settings:**
- [x] Draft & Publish: ON
- [x] Localization: ON (i18n enabled)

---

### 2.2 SECOND: Create "Property" Collection WITH RELATION
Go to Content-Type Builder → Create collection type:

**Display Name:** Property  
**API ID:** property

**IMPORTANT: Create fields in THIS EXACT ORDER:**

| # | Field Name | Type | Required | Other Settings |
|---|------------|------|----------|----------------|
| 1 | name | Short Text | YES | i18n: ON |
| 2 | project | Relation | YES | **See instructions below** |
| 3 | area | Short Text | YES | - |
| 4 | city | Short Text | YES | - |
| 5 | price | Decimal | YES | Min: 0 |
| 6 | property_type | Enumeration | YES | Values: studio, f1, f2, f3, f4, f5+, garage |
| 7 | space_sqm | Decimal | YES | Min: 0 |
| 8 | beds | Integer | YES | Min: 0 |
| 9 | baths | Integer | YES | Min: 0 |
| 10 | image | Single Media | YES | Allowed types: Images |
| 11 | gallery | Multiple Media | NO | Allowed types: Images |
| 12 | description | Rich Text | NO | i18n: ON |
| 13 | property_code | UID | YES | Attached to: name |

**Creating the RELATION field (Field #2):**
1. Click "Add Another Field"
2. Select **Relation** (last option in the list)
3. Configure the relation:
   - Right side (Property): "has one" or "has many"
   - Left side (Project): "has one" or "belongs to one" or "has many"
4. **Name the field exactly: `project`** (lowercase, no spaces)
5. Click Continue
6. **Make it Required: YES**

**Settings:**
- [x] Draft & Publish: ON
- [x] Localization: ON (i18n enabled)

---

## Phase 3: Create Components

### 3.1 Property Feature Component
Go to Components → Create component:

**Display Name:** property-feature  
**Category:** property

**Fields:**
| Field Name | Type |
|------------|------|
| feature_name | Short Text |
| feature_icon | Short Text |

After creating, go back to Property content type and add:
- Add Field → Component → property-feature (Repeatable, Required: NO)

---

## Phase 4: Configure Permissions (CRITICAL!)

### 4.1 Go to Settings
Settings → Users & Permissions Plugin → Roles

### 4.2 Public Role
Click on **Public** role:

**Property (permissions to enable):**
- [x] find
- [x] findOne

**Project (permissions to enable):**
- [x] find  
- [x] findOne

**Click Save**

### 4.3 Why Both Are Needed
For the filter `?filters[project][name][$eq]=...` to work, BOTH Property AND Project must have find/findOne permissions. This is how Strapi handles deep filtering.

---

## Phase 5: Add Content

### 5.1 Add Projects First
Go to Content Manager → Project → Create New:

| Name | City | Place | Short Description |
|------|------|-------|-------------------|
| Marina Bay | Dubai | Dubai Marina | Luxury waterfront living in the heart of Dubai Marina |
| Downtown Views | Dubai | Downtown Dubai | Modern apartments with stunning skyline views |
| Palm Residences | Dubai | Palm Jumeirah | Exclusive beachfront living on Palm Jumeirah |
| Garden Heights | Dubai | Jumeirah Golf Estates | Green oasis in Jumeirah Golf Estates |

**For each project:**
1. Fill in all text fields
2. Upload first_image (required)
3. Upload second_image (required)
4. Click Save and Publish

---

### 5.2 Add Properties (LINK TO PROJECTS!)
Go to Content Manager → Property → Create New:

Create 4 properties for EACH project (16 total):

**Marina Bay Properties (4):**
| Name | Area | Price | Type | Beds | Baths | sqm | Image |
|------|------|-------|------|------|-------|-----|-------|
| Marina Luxe Apartment | Dubai Marina | 1200000 | f2 | 2 | 2 | 145 | Upload |
| Marina Penthouse | Dubai Marina | 2800000 | f3 | 3 | 3 | 210 | Upload |
| Marina Studio | Dubai Marina | 650000 | studio | 1 | 1 | 55 | Upload |
| Marina Family Home | Dubai Marina | 1850000 | f4 | 4 | 3 | 180 | Upload |

**For EACH property, CRITICAL step:**
- In the project dropdown, select **Marina Bay**
- This links the property to the project!

**Downtown Views Properties (4):**
| Name | Area | Price | Type | Beds | Baths | sqm |
|------|------|-------|------|------|-------|-----|
| Downtown Loft | Downtown Dubai | 950000 | f1 | 1 | 1 | 85 |
| Downtown Executive | Downtown Dubai | 1650000 | f2 | 2 | 2 | 125 |
| Downtown Grand Suite | Downtown Dubai | 2200000 | f3 | 3 | 3 | 165 |
| Downtown Investment | Downtown Dubai | 780000 | f1 | 1 | 1 | 70 |

**Palm Residences Properties (4):**
| Name | Area | Price | Type | Beds | Baths | sqm |
|------|------|-------|------|------|-------|-----|
| Palm Beach Studio | Palm Jumeirah | 850000 | studio | 1 | 1 | 60 |
| Palm Villa | Palm Jumeirah | 4500000 | f5+ | 5 | 6 | 350 |
| Palm Apartment | Palm Jumeirah | 1350000 | f2 | 2 | 2 | 110 |
| Palm Family Suite | Palm Jumeirah | 1950000 | f3 | 3 | 3 | 155 |

**Garden Heights Properties (4):**
| Name | Area | Price | Type | Beds | Baths | sqm |
|------|------|-------|------|------|-------|-----|
| Garden Apartment | Jumeirah Golf Estates | 1100000 | f2 | 2 | 2 | 130 |
| Garden Villa | Jumeirah Golf Estates | 3200000 | f4 | 4 | 4 | 280 |
| Garden Studio | Jumeirah Golf Estates | 580000 | studio | 1 | 1 | 48 |
| Garden Estate | Jumeirah Golf Estates | 4100000 | f5+ | 5 | 5 | 320 |

**For EACH property:**
1. Fill in all fields
2. **SELECT THE PROJECT** from dropdown (CRITICAL!)
3. Upload image
4. Click Save and Publish

---

## Phase 6: Connect to Frontend (EXACT SETUP)

### 6.1 API Connection (EXACT LIKE CURRENT)
The frontend uses:
- **Base URL**: http://localhost:1337
- **Proxy**: Vite proxies `/api` to `http://localhost:1337`

### 6.2 Endpoints (MUST WORK EXACTLY LIKE THIS)

**Test these in browser/Postman:**

```bash
# 1. Get all properties with relations
GET http://localhost:1337/api/properties?populate=*

# Expected response format:
{
  "data": [
    {
      "id": 1,
      "documentId": "abc123",
      "name": "Marina Luxe Apartment",
      "area": "Dubai Marina",
      "city": "Dubai",
      "price": 1200000,
      "property_type": "f2",
      "space_sqm": 145,
      "beds": 2,
      "baths": 2,
      "image": { /* image object */ },
      "property_code": "VH-001",
      "project": { /* project object */ }
    }
  ],
  "meta": {
    "pagination": {
      "total": 16
    }
  }
}

# 2. Filter by project name (THIS MUST WORK!)
GET http://localhost:1337/api/properties?filters[project][name][$eq]=Marina%20Bay&populate=*

# Expected: Returns only the 4 Marina Bay properties

# 3. Get all projects
GET http://localhost:1337/api/projects?populate=*
```

### 6.3 Important: Response Format
The frontend code expects:
- `response.data` to be an ARRAY
- Each item has: id, documentId, name, area, city, price, property_type, space_sqm, beds, baths, image, property_code, **project**
- **project** should be an object when using `populate=*`

### 6.4 Query String Format
The frontend uses `qs` library with `{ encodeValuesOnly: true }`:
- `filters[project][name][$eq]=Marina Bay` 
- Becomes: `filters%5Bproject%5D%5Bname%5D%5B%24eq%5D=Marina%20Bay`

---

## Phase 7: Verify Before Testing Frontend

### 7.1 Run These Tests
Open browser and test:

1. **Test 1**: `http://localhost:1337/api/properties?populate=*`
   - Should return 16 properties
   - Each property should have a "project" field with data

2. **Test 2**: `http://localhost:1337/api/properties?filters[project][name][$eq]=Marina%20Bay&populate=*`
   - Should return 4 properties
   - NOT "Invalid key project" error!

3. **Test 3**: `http://localhost:1337/api/projects?populate=*`
   - Should return 4 projects

### 7.2 If Tests Fail

**If "Invalid key project" error:**
- The relation isn't working - check Content-Type Builder
- Make sure project field exists on Property
- Check permissions (both Property AND Project need access)

**If empty array returned:**
- Check that properties are linked to projects in Content Manager
- Make sure properties are Published (not Draft)

---

## Phase 8: Frontend Connection

### 8.1 Update Environment
In frontend folder:
```env
VITE_API_URL=http://localhost:1337
```

### 8.2 Test Frontend
1. Start frontend: `npm run dev`
2. Visit http://localhost:3000
3. Properties should load
4. Try filtering by project - should show only that project's properties

---

## Summary: What Must Be EXACTLY Like Current Setup

| Item | Current Setup | New Setup Must Have |
|------|--------------|---------------------|
| Strapi Version | v5 (broken) | v4 |
| Database | SQLite | SQLite (or Postgres) |
| Property Fields | 13 fields | Must match |
| Project Relation | "project" field | Must be named "project" |
| Filter Syntax | filters[project][name][$eq] | Must work! |
| Response Format | response.data = Array | Must match |
| Project in Response | Included with populate=* | Must work |

---

## Troubleshooting

### If filters[project] still doesn't work:
1. Check Content-Type Builder - does Property have "project" relation?
2. Check Content Manager - are properties linked to projects?
3. Check Permissions - Public role has find for both Property AND Project?
4. Clear cache: stop server, delete .cache and dist, rebuild

---

*Document created for VistaHaven Real Estate - April 2026*