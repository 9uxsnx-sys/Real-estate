const axios = require('axios');

const API_URL = 'http://localhost:1337/api';

const projectMap = {
  'Marina Bay': 'jlgfunajewj3gm9wf4qtuxvh',
  'Downtown Views': 'xl67px26k7zej3zp6vhig8ko',
  'Palm Residences': 'isn7euv32gmm5f3taek1bk8o',
  'Garden Heights': 'dhrwbgkbpsecusk16z1zwp4l',
};

// Properties grouped by project
const propertyLinks = [
  { name: 'Marina Luxe Apartment', project: 'Marina Bay' },
  { name: 'Marina Penthouse', project: 'Marina Bay' },
  { name: 'Marina Studio', project: 'Marina Bay' },
  { name: 'Marina Family Home', project: 'Marina Bay' },
  { name: 'Downtown Loft', project: 'Downtown Views' },
  { name: 'Downtown Executive', project: 'Downtown Views' },
  { name: 'Downtown Grand Suite', project: 'Downtown Views' },
  { name: 'Downtown Investment', project: 'Downtown Views' },
  { name: 'Palm Beach Studio', project: 'Palm Residences' },
  { name: 'Palm Villa', project: 'Palm Residences' },
  { name: 'Palm Apartment', project: 'Palm Residences' },
  { name: 'Palm Family Suite', project: 'Palm Residences' },
  { name: 'Garden Apartment', project: 'Garden Heights' },
  { name: 'Garden Villa', project: 'Garden Heights' },
  { name: 'Garden Studio', project: 'Garden Heights' },
  { name: 'Garden Estate', project: 'Garden Heights' },
];

async function updatePropertyProject(propertyName, projectName) {
  try {
    const projectDocId = projectMap[projectName];
    if (!projectDocId) {
      console.error(`✗ Unknown project: ${projectName}`);
      return false;
    }

    // Get property by name
    const getRes = await axios.get(`${API_URL}/properties`, {
      params: { filters: { name: { $eq: propertyName } } }
    });

    if (getRes.data.data.length === 0) {
      console.error(`✗ Property not found: ${propertyName}`);
      return false;
    }

    const propertyDocId = getRes.data.data[0].documentId;

    // Update with relation using connect syntax
    await axios.put(`${API_URL}/properties/${propertyDocId}`, {
      data: {
        project: projectDocId
      }
    });

    console.log(`✓ Linked: ${propertyName} → ${projectName}`);
    return true;
  } catch (error) {
    console.error(`✗ Failed: ${propertyName}`);
    if (error.response) {
      console.error('  Error:', JSON.stringify(error.response.data, null, 2));
    } else {
      console.error('  Error:', error.message);
    }
    return false;
  }
}

async function main() {
  console.log('Linking properties to projects...\n');

  for (const link of propertyLinks) {
    await updatePropertyProject(link.name, link.project);
  }

  console.log('\nDone!');
}

main();