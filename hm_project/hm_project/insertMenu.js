import { connectDB, getAtlasDB } from './mongo-context.js';
import menuData from './menudata.json' assert { type: "json" };

async function insertMenu() {
  await connectDB();
  const db = getDB();
  const menuItems = [];

  for (const category in menuData) {
    menuData[category].forEach(item => {
      menuItems.push({ ...item, category });
    });
  }

  await db.collection('menu').insertMany(menuItems);
  console.log('Menu items inserted');
}

insertMenu();
