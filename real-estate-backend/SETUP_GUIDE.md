# Strapi Backend Setup Guide

## Overview
This guide documents the complete setup process for the VistaHaven Real Estate Strapi backend, including issues encountered and solutions.

---

## Prerequisites

| Requirement | Version |
|-------------|---------|
| Node.js | 20.x (LTS recommended, 24.x works with fixes) |
| npm | 6.x or higher |
| OS | Windows (PowerShell) / macOS / Linux |

---

## Step 1: Installation

### Command
```bash
npx create-strapi-app@latest real-estate-backend --quickstart --no-run --skip-cloud --non-interactive
```

### Notes
- Use `--skip-cloud` to bypass interactive login prompts
- Use `--no-run` to prevent server auto-start
- Use `--non-interactive` for automated setup

---

## Step 2: Install Dependencies

```bash
cd real-estate-backend
npm install
```

---

## Step 3: Build Admin UI

```bash
npm run build
```

### Why Build is Required
- Compiles TypeScript to JavaScript
- Bundles the admin panel assets
- Required before first server start

---

## Step 4: Fix Native Module Issues (Node.js 24.x)

If using Node.js 24.x, better-sqlite3 may fail to load:

### Issue
```
Error: Could not locate the bindings file
```

### Solution
```bash
npm rebuild better-sqlite3
```

---

## Step 5: Start Server

```bash
npm run develop
```

### Server Details
- URL: http://localhost:1337/admin
- Database: SQLite (.tmp/data.db)
- Edition: Community

---

## Step 6: Create Admin Account

1. Open http://localhost:1337/admin in browser
2. Enter registration details:
   - Email: admin@strapidemo.com (or your choice)
   - First Name: (your name)
   - Last Name: (your name)
3. Set password
4. Click "Let's Start"

### Note: "Finish" Button Not Working

If the "Finish" button doesn't respond:
1. Stop the server (Ctrl+C)
2. Run `npm run build` again
3. Restart with `npm run develop`
4. Refresh browser and try again

---

## Issues Found & Solutions

### Issue 1: PowerShell Execution Policy
**Error:**
```
Cannot load file because running scripts is disabled
```

**Solution:**
```powershell
powershell -ExecutionPolicy Bypass -Command "your-command"
```

---

### Issue 2: Interactive Login Prompt
**Error:**
```
? Please log in or sign up.
```

**Solution:**
Use `--skip-cloud` flag:
```bash
npx create-strapi-app@latest real-estate-backend --quickstart --no-run --skip-cloud
```

---

### Issue 3: better-sqlite3 Bindings Not Found
**Error:**
```
Error: Could not locate the bindings file
```

**Solution:**
```bash
npm rebuild better-sqlite3
```

---

### Issue 4: Blank Admin Page
**Symptom:** White screen after server start

**Solution:**
1. Stop server
2. Run `npm run build`
3. Restart server
4. Wait 15-20 seconds before opening browser

---

### Issue 5: "Finish" Button Not Responding
**Symptom:** Selected option but nothing happens

**Solution:**
```bash
# Stop server if running
npm run build
npm run develop
# Wait 15+ seconds, then open browser
```

---

### Issue 6: Server Stopped Unexpectedly
**Symptom:** Terminal closed, server stops

**Solution:**
Use detached process:
```powershell
Start-Process powershell -ArgumentList '-NoExit', '-Command', 'cd C:\path\to\real-estate-backend; npm run develop'
```

---

## Quick Reference Commands

| Action | Command |
|--------|---------|
| Install | `npx create-strapi-app@latest real-estate-backend --quickstart --no-run --skip-cloud --non-interactive` |
| Dependencies | `cd real-estate-backend && npm install` |
| Build | `npm run build` |
| Start | `npm run develop` |
| Rebuild native | `npm rebuild better-sqlite3` |

---

## File Structure

```
real-estate-backend/
├── src/
│   ├── admin/          # Admin panel config
│   ├── api/           # API routes
│   └── extensions/     # Custom extensions
├── dist/             # Compiled output
├── node_modules/       # Dependencies
├── .env              # Environment variables
├── package.json      # Project config
└── tsconfig.json   # TypeScript config
```

---

## Next Steps (Phase 2)

After setup confirmation:
1. Do NOT create content types yet
2. Wait for schema injection instructions
3. Backend is ready for manual configuration

---

## Support

- Strapi v5.43.0
- Node.js v24.15.0 (with fixes)
- SQLite database