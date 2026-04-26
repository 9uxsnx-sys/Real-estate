const { Client } = require('pg');

async function testDB() {
  const client = new Client({
    connectionString: 'postgresql://postgres:admin@127.0.0.1:5432/payload_real_estate'
  });
  
  try {
    await client.connect();
    const result = await client.query('SELECT 1');
    console.log('Database connected successfully');
    await client.end();
  } catch (err) {
    console.log('Database error:', err.message);
  }
}

testDB();