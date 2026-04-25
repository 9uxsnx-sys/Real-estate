const axios = require('axios');

const API_URL = 'http://localhost:1337/api';

const projects = {
  'Marina Bay': 'jlgfunajewj3gm9wf4qtuxvh',
  'Downtown Views': 'xl67px26k7zej3zp6vhig8ko',
  'Palm Residences': 'isn7euv32gmm5f3taek1bk8o',
  'Garden Heights': 'dhrwbgkbpsecusk16z1zwp4l',
};

const properties = [
  { name: 'Marina Luxe Apartment', project: 'Marina Bay', area: 'Dubai Marina', city: 'Dubai', price: 1200000, property_type: 'f2', space_sqm: 145, beds: 2, baths: 2, property_code: 'VH-001' },
  { name: 'Marina Penthouse', project: 'Marina Bay', area: 'Dubai Marina', city: 'Dubai', price: 2800000, property_type: 'f3', space_sqm: 210, beds: 3, baths: 3, property_code: 'VH-002' },
  { name: 'Marina Studio', project: 'Marina Bay', area: 'Dubai Marina', city: 'Dubai', price: 650000, property_type: 'studio', space_sqm: 55, beds: 1, baths: 1, property_code: 'VH-003' },
  { name: 'Marina Family Home', project: 'Marina Bay', area: 'Dubai Marina', city: 'Dubai', price: 1850000, property_type: 'f4', space_sqm: 180, beds: 4, baths: 3, property_code: 'VH-004' },
  { name: 'Downtown Loft', project: 'Downtown Views', area: 'Downtown Dubai', city: 'Dubai', price: 950000, property_type: 'f1', space_sqm: 85, beds: 1, baths: 1, property_code: 'VH-005' },
  { name: 'Downtown Executive', project: 'Downtown Views', area: 'Downtown Dubai', city: 'Dubai', price: 1650000, property_type: 'f2', space_sqm: 125, beds: 2, baths: 2, property_code: 'VH-006' },
  { name: 'Downtown Grand Suite', project: 'Downtown Views', area: 'Downtown Dubai', city: 'Dubai', price: 2200000, property_type: 'f3', space_sqm: 165, beds: 3, baths: 3, property_code: 'VH-007' },
  { name: 'Downtown Investment', project: 'Downtown Views', area: 'Downtown Dubai', city: 'Dubai', price: 780000, property_type: 'f1', space_sqm: 70, beds: 1, baths: 1, property_code: 'VH-008' },
  { name: 'Palm Beach Studio', project: 'Palm Residences', area: 'Palm Jumeirah', city: 'Dubai', price: 850000, property_type: 'studio', space_sqm: 60, beds: 1, baths: 1, property_code: 'VH-009' },
  { name: 'Palm Villa', project: 'Palm Residences', area: 'Palm Jumeirah', city: 'Dubai', price: 4500000, property_type: 'f5+', space_sqm: 350, beds: 5, baths: 6, property_code: 'VH-010' },
  { name: 'Palm Apartment', project: 'Palm Residences', area: 'Palm Jumeirah', city: 'Dubai', price: 1350000, property_type: 'f2', space_sqm: 110, beds: 2, baths: 2, property_code: 'VH-011' },
  { name: 'Palm Family Suite', project: 'Palm Residences', area: 'Palm Jumeirah', city: 'Dubai', price: 1950000, property_type: 'f3', space_sqm: 155, beds: 3, baths: 3, property_code: 'VH-012' },
  { name: 'Garden Apartment', project: 'Garden Heights', area: 'Jumeirah Golf Estates', city: 'Dubai', price: 1100000, property_type: 'f2', space_sqm: 130, beds: 2, baths: 2, property_code: 'VH-013' },
  { name: 'Garden Villa', project: 'Garden Heights', area: 'Jumeirah Golf Estates', city: 'Dubai', price: 3200000, property_type: 'f4', space_sqm: 280, beds: 4, baths: 4, property_code: 'VH-014' },
  { name: 'Garden Studio', project: 'Garden Heights', area: 'Jumeirah Golf Estates', city: 'Dubai', price: 580000, property_type: 'studio', space_sqm: 48, beds: 1, baths: 1, property_code: 'VH-015' },
  { name: 'Garden Estate', project: 'Garden Heights', area: 'Jumeirah Golf Estates', city: 'Dubai', price: 4100000, property_type: 'f5+', space_sqm: 320, beds: 5, baths: 5, property_code: 'VH-016' },
];

async function createProperty(property) {
  try {
    // Create property without relation field
    const createRes = await axios.post(`${API_URL}/properties`, {
      data: {
        name: property.name,
        area: property.area,
        city: property.city,
        price: property.price,
        property_type: property.property_type,
        space_sqm: property.space_sqm,
        beds: property.beds,
        baths: property.baths,
        property_code: property.property_code,
      }
    });

    console.log(`✓ Created: ${property.name}`);
    return createRes.data;
  } catch (error) {
    console.error(`✗ Failed to create: ${property.name}`);
    if (error.response) {
      console.error('  Error:', JSON.stringify(error.response.data, null, 2));
    } else {
      console.error('  Error:', error.message);
    }
    return null;
  }
}

async function main() {
  console.log('Creating properties...\n');

  for (const property of properties) {
    await createProperty(property);
  }

  console.log('\nDone! Checking created properties...');

  try {
    const response = await axios.get(`${API_URL}/properties`);
    console.log(`Total properties: ${response.data.data.length}`);
  } catch (error) {
    console.error('Failed to fetch properties:', error.message);
  }
}

main();