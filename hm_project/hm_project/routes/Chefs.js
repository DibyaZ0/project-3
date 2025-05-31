import express from 'express';
import { getAllChefs } from '../controllers/ChefController.js';

const router = express.Router();

// Route to get all chefs
router.get('/', getAllChefs);

export default router;
