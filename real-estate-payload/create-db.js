const { Client } = require('pg');

async function createDatabase() {
  const client = new Client({
    connectionString: 'postgresql://postgres:admin@127.0.0.1:5432/postgres'
  });
  
  try {
    await client.connect();
    await client.query('CREATE DATABASE "payload_real_estate"');
    console.log('Database created successfully');
  } catch (err) {
    if (err.code === '42P04') {
      console.log('Database already exists');
    } else {
      console.log('Error:', err.message);
    }
  } finally {
    await client.end();
  }
}

createDatabase();