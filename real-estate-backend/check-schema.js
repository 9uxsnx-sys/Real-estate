const sqlite3 = require('sqlite3').verbose();
const db = new sqlite3.Database('./.tmp/data.db');

db.run('ALTER TABLE properties ADD COLUMN project_id INTEGER REFERENCES projects(id)', (err) => {
  if (err) {
    console.log('Column may already exist or error:', err.message);
  } else {
    console.log('Added project_id column successfully!');
  }
  
  // Verify the schema now
  db.all('PRAGMA table_info(properties)', (err, rows) => {
    console.log('Updated Properties table schema:');
    console.log(JSON.stringify(rows, null, 2));
    db.close();
  });
});