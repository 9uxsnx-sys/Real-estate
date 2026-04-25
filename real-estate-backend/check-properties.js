const axios = require('axios');

(async () => {
  const r = await axios.get('http://localhost:1337/api/properties');
  console.log('Total properties:', r.data.data.length);
  console.log('\nProperties:');
  r.data.data.forEach(p => {
    console.log(`- ${p.property_code}: ${p.name} (${p.property_type})`);
  });
})();