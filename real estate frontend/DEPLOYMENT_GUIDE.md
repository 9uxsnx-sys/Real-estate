# 🚀 Frappe v15 Local Deployment Guide (Custom App)

## 🎯 Objective

Deploy a fully working Frappe environment locally using a custom app (`algeria_seller_erp`) starting from:

* A clean system (no Frappe installed)
* A local folder containing ONLY the app source code

Final goal:

* App running at http://localhost:8000
* No errors
* Fully functional ERP

---

# 🚨 CRITICAL RULES (DO NOT BREAK)

1. ❌ Do NOT use Windows Python
2. ❌ Do NOT manually install Frappe in /apps
3. ❌ Do NOT use Docker images
4. ❌ Do NOT skip bench commands
5. ❌ Do NOT install app without `bench get-app`

👉 The entire system MUST be managed by **bench**

---

# 🧱 SYSTEM REQUIREMENTS

* OS: Ubuntu (WSL2 or native Linux)
* Python: 3.10–3.11 (NOT 3.12+)
* Node.js: 18
* MariaDB: 10.6+
* Redis: 6+

---

# ⚙️ STEP 1: INSTALL SYSTEM DEPENDENCIES

```bash
sudo apt update && sudo apt upgrade -y

sudo apt install -y python3-dev python3-pip python3-venv \
  mariadb-server redis-server \
  nodejs npm yarn \
  git curl
```

---

# ⚠️ PREVENT COMMON FAILURE #1 (Node Version)

Ensure Node is version 18:

```bash
node -v
```

If not → install Node 18 manually.

---

# ⚙️ STEP 2: INSTALL BENCH

```bash
pip3 install frappe-bench
```

Verify:

```bash
bench --version
```

---

# ⚙️ STEP 3: INITIALIZE FRAPPE

```bash
bench init frappe-bench --frappe-branch version-15
cd frappe-bench
```

---

# ⚠️ PREVENT COMMON FAILURE #2 (Permissions)

If permission errors occur:

```bash
sudo chown -R $USER:$USER frappe-bench
```

---

# ⚙️ STEP 4: CREATE SITE

```bash
bench new-site mysite.local
```

* Set MariaDB root password
* Set Administrator password

---

# ⚠️ PREVENT COMMON FAILURE #3 (MariaDB)

If DB connection fails:

```bash
sudo service mysql start
```

---

# ⚙️ STEP 5: ADD CUSTOM APP

## 📂 Source app location:

Assume app is in current workspace folder:

```
./algeria_seller_erp
```

---

## 🔥 IMPORTANT: DO NOT JUST COPY

Correct method:

```bash
bench get-app algeria_seller_erp ./algeria_seller_erp
```

---

# ⚠️ PREVENT COMMON FAILURE #4 (App Not Found)

Check:

```bash
ls apps/
```

You should see:

* frappe
* algeria_seller_erp

---

# ⚙️ STEP 6: INSTALL APP

```bash
bench --site mysite.local install-app algeria_seller_erp
```

---

# ⚠️ PREVENT COMMON FAILURE #5 (Import Errors)

If error:

* "module not found"

Fix:

```bash
bench setup requirements
```

---

# ⚙️ STEP 7: MIGRATE

```bash
bench --site mysite.local migrate
```

---

# ⚠️ PREVENT COMMON FAILURE #6 (Missing Tables)

Always run migrate after install.

---

# ⚙️ STEP 8: START SERVER

```bash
bench start
```

---

# 🌐 ACCESS SYSTEM

Open:

http://localhost:8000

Login:

* User: Administrator
* Password: (set earlier)

---

# 🧪 VALIDATION CHECKLIST

* [ ] Login works
* [ ] Dashboard loads
* [ ] Can create Product
* [ ] Can create Customer
* [ ] Can create COD Order
* [ ] Workflow works

---

# 🚨 DEBUGGING PLAYBOOK

## 🔴 Issue: App not showing

```bash
bench --site mysite.local list-apps
```

If missing:
→ reinstall app

---

## 🔴 Issue: Redis error

```bash
sudo service redis-server start
```

---

## 🔴 Issue: Node build fails

```bash
bench setup requirements
bench build
```

---

## 🔴 Issue: Port already used

```bash
lsof -i :8000
kill -9 <PID>
```

---

# 🧠 BEST PRACTICES

* Always use `bench`
* Always use Linux
* Always run `migrate`
* Never hack dependencies

---

# 🚀 NEXT STEP (AFTER SUCCESS)

Production deployment:

```bash
bench setup production frappe
```

---

# 🎯 FINAL NOTE

If the system is not working:

👉 The issue is ALWAYS:

* environment
* dependencies
* incorrect process

NOT the app.

Follow this guide exactly.
