import express from 'express';
import { getAllOrders, saveOrderRecord, updateOrderRecord } from '../controllers/OrderController.js';

const router = express.Router();

router.get('/', async (req, res) => {
  const orders = await getAllOrders();
  res.json(orders);
});

router.post('/', async (req, res) => {
  const order = req.body;
  const result = await saveOrderRecord(order);
  res.json(result);
});

router.post('/:id', async (req, res) => {
  const id = req.params.id;
  const update = req.body;
  const result = await updateOrderRecord(id);
  res.json(result);
});

export default router;
