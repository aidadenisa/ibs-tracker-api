import express from 'express';
import eventsService from '../services/events.js';

const router = express.Router();

router.get('/', async (req, res) => {
  const result = await eventsService.listEvents();
  res.json(result);
})

export default router;