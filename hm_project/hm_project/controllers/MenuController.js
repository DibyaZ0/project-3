import { getAtlasDB } from '../mongo-context.js';

const menuCollection = 'menu';

export async function getMenuItems() {
  const db = getAtlasDB();
  return await db.collection(menuCollection).find({}).toArray();
}
