const sqlite3 = require('sqlite3').verbose();
const db = new sqlite3.Database('./.tmp/data.db');

db.all('SELECT COUNT(*) as count FROM properties WHERE project_id IS NOT NULL', (err, rows) => {
  if (err) {
    console.error('Error:', err);
  } else {
    console.log('Properties with project_id:', rows[0].count);
  }
  db.close();
});