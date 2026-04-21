#!/bin/bash
set -e
cd /tmp/vista_haven_app
git init
git config user.email admin@vistahaven.com
git config user.name VistaHaven
git add -A
git commit -m initial
echo Git ready

cd /home/frappe/frappe-bench
bench get-app vista_haven /tmp/vista_haven_app
echo App fetched

bench --site mysite.local install-app vista_haven
echo App installed

bench --site mysite.local migrate
echo Migration done
