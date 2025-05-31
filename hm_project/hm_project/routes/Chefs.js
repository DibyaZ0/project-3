import express from 'express';
import { getAllChefs } from '../controllers/ChefController.js';

const router = express.Router();

router.get('/', getAllChefs);

export default router;
