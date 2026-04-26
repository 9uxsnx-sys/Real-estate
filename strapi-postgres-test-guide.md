# Strapi v5 + PostgreSQL Test Installation

## Phase 1: Prerequisites

### 1.1 Install PostgreSQL
- Download from: https://www.enterprisedb.com/downloads/postgresql
- OR use winget: `winget install PostgreSQL.PostgreSQL`
- Set password to: `postgres`
- Keep default port: `5432`

### 1.2 Create Database
```bash
# Open pgAdmin or cmd:
# Create database named: strapi_test
```

---

## Phase 2: Create Fresh Strapi v5

```bash
cd C:\Users\akramba\Downloads\dev-test

# Create Strapi v5 with PostgreSQL
npx create-strapi-app@latest strapi-test --database=postgres

# When prompting:
# - Database name: strapi_test
# - Username: postgres
# - Password: postgres
# - Host: localhost
# - Port: 5432
```

---

## Phase 3: Create Test Content Types

### 3.1 Create Project Collection Type
Go to Content-Type Builder → Create new collection type:

**Display Name:** Project
**API ID:** project

**Fields:**
| Field | Type | Required |
|-------|------|----------|
| name | Short Text | YES |
| short_description | Short Text | YES |
| city | Short Text | YES |
| place | Short Text | YES |
| description | Rich Text | NO |
| first_image | Single Media | YES |
| second_image | Single Media | YES |

**Settings:** Draft & Publish: ON, Localization: ON

---

### 3.2 Create Property Collection Type
Go to Content-Type Builder → Create new collection type:

**Display Name:** Property  
**API ID:** property

**Fields (in order):**
| # | Field | Type | Required |
|---|------|------|----------|
| 1 | name | Short Text | YES |
| 2 | project | Relation | YES |
| 3 | area | Short Text | YES |
| 4 | city | Short Text | YES |
| 5 | price | Decimal | YES |
| 6 | property_type | Enumeration | YES |
| 7 | space_sqm | Decimal | YES |
| 8 | beds | Integer | YES |
| 9 | baths | Integer | YES |
| 10 | image | Single Media | YES |
| 11 | property_code | UID | YES |

**Creating the Relation:**
1. Add Field → Relation
2. Configure:
   - Right: Property has one/belongs to one
   - Left: Project has many
3. Name the field: `project`
4. Required: YES

**Settings:** Draft & Publish: ON, Localization: ON

---

## Phase 4: Add Test Content

### 4.1 Add 2 Projects
Create these in Content Manager → Projects:

| Name | City | Place | Short Description |
|------|------|-------|-------------------|
| Test Marina | Dubai | Dubai Marina | Test Marina project |
| Test Downtown | Dubai | Downtown Dubai | Test Downtown project |

**Upload any image for first_image and second_image**

---

### 4.2 Add 4 Properties
Create these in Content Manager → Properties:

| Name | Area | Price | Type | Beds | Baths | sqm | Project |
|------|------|-------|------|------|-------|-----|---------|
| Test Apt 1 | Dubai Marina | 100000 | f1 | 1 | 1 | 50 | Test Marina |
| Test Apt 2 | Dubai Marina | 150000 | f2 | 2 | 1 | 75 | Test Marina |
| Test Apt 3 | Downtown Dubai | 200000 | f1 | 1 | 1 | 60 | Test Downtown |
| Test Apt 4 | Downtown Dubai | 250000 | f2 | 2 | 1 | 80 | **(NONE)** |

**Upload any image for each property**

---

## Phase 5: Test the Relation

### 5.1 Configure Permissions
Settings → Users & Permissions → Roles → Public:

**Property:** find, findOne  
**Project:** find, findOne

Save permissions.

### 5.2 Test in Browser

```
Test A - Get all properties:
http://localhost:1337/api/properties?populate=*

Test B - Filter by linked project (SHOULD return 2 properties):
http://localhost:1337/api/properties?filters[project][name][$eq]=Test%20Marina&populate=*

Test C - Filter by another linked project (SHOULD return 1 property):
http://localhost:1337/api/properties?filters[project][name][$eq]=Test%20Downtown&populate=*

Test D - Get all projects:
http://localhost:1337/api/projects?populate=*
```

---

## Phase 6: Interpretation of Results

### If Test B returns 2 properties ✅
- PostgreSQL + Strapi v5 relation WORKS!
- Proceed to Phase 7 (full migration)

### If Test B returns "Invalid key project" ❌
- Relation still broken
- Try creating a fresh Strapi from scratch
- Or try clearing database and relations

### If Test B returns 0 properties ❌
- Properties not properly linked
- Check Content Manager - verify project dropdown selection

---

## Phase 7: Full Migration (If Tests Pass)

If all tests pass, then:
1. Document current backend fields
2. Recreate full Project and Property content types in new Strapi
3. Add all 16 properties with images
4. Link each to correct project
5. Connect frontend
6. Verify everything works

---

## Test Completion Checklist

- [ ] PostgreSQL installed and running
- [ ] strapi-test project created
- [ ] Project content type created with relation
- [ ] Property content type created with relation
- [ ] 2 projects added
- [ ] 4 properties added (3 linked, 1 not)
- [ ] Test A works (get all)
- [ ] Test B works (filter by project) ← KEY TEST
- [ ] Test C returns correct count
- [ ] Test D works (get projects)

---

*Created for VistaHaven testing - April 2026*