const axios = require('axios');

(async () => {
  const r = await axios.get('http://localhost:1337/api/projects');
  console.log(JSON.stringify(r.data.data, null, 2));
})();