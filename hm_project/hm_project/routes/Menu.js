import express from 'express';
import { getMenuItems } from '../controllers/MenuController.js';

const router = express.Router();

router.get('/', async (req, res) => {
  try {
    const items = await getMenuItems();
    res.json(items);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch menu items' });
  }
});

export default router;
