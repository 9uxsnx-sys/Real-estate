const sqlite3 = require('sqlite3').verbose();
const db = new sqlite3.Database('./.tmp/data.db');

// Map areas to project IDs
const areaToProjectId = {
  'Dubai Marina': 2,      // Marina Bay
  'Downtown Dubai': 4,    // Downtown Views
  'Palm Jumeirah': 6,     // Palm Residences
  'Jumeirah Golf Estates': 8  // Garden Heights
};

console.log('Linking properties to projects based on area...');

let updates = 0;
const propertyIds = [];

db.all('SELECT id, area FROM properties', (err, rows) => {
  if (err) {
    console.error('Error fetching properties:', err);
    db.close();
    return;
  }

  const updatesNeeded = rows.map(property => {
    const projectId = areaToProjectId[property.area];
    if (projectId) {
      return new Promise((resolve, reject) => {
        db.run('UPDATE properties SET project_id = ? WHERE id = ?', [projectId, property.id], function(err) {
          if (err) {
            console.error(`Error updating property ${property.id}:`, err);
            reject(err);
          } else {
            console.log(`✓ Linked property ${property.id} (${property.area}) to project ${projectId}`);
            updates++;
            resolve();
          }
        });
      });
    } else {
      console.log(`⚠ Property ${property.id} has area "${property.area}" - no matching project`);
      return Promise.resolve();
    }
  });

  Promise.all(updatesNeeded).then(() => {
    console.log(`\n✅ Migration complete! Updated ${updates} properties.`);
    
    // Verify the updates
    db.all('SELECT p.id, p.name, p.area, p.project_id, pr.name as project_name FROM properties p LEFT JOIN projects pr ON p.project_id = pr.id', (err, rows) => {
      console.log('\nProperty-Project links:');
      console.log(JSON.stringify(rows, null, 2));
      db.close();
    });
  }).catch(err => {
    console.error('Migration failed:', err);
    db.close();
  });
});