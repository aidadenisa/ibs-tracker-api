import express from 'express';
import { Event } from '../db/schemas.js';

const router = express.Router();

router.get('/', async (req, res) => {
  const result = await Event.find({}).populate('category')
  res.json(result);
})

export default router;