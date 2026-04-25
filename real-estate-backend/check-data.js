const sqlite3 = require('sqlite3').verbose();
const db = new sqlite3.Database('./.tmp/data.db');

db.all('SELECT p.id, p.name, p.area, p.project_id, pr.name as project_name FROM properties p LEFT JOIN projects pr ON p.project_id = pr.id ORDER BY p.id', (err, rows) => {
  if (err) {
    console.error('Error:', err);
    db.close();
    return;
  }
  console.log('Property ID | Name | Area | Project ID | Project Name');
  console.log('------------|------|------|------------|---------------');
  rows.forEach(r => {
    console.log(`${r.id} | ${r.name} | ${r.area} | ${r.project_id} | ${r.project_name || 'NULL'}`);
  });
  db.close();
});