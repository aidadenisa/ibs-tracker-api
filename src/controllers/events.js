import express from 'express';
import eventsService from '../../services/events.js';

const router = express.Router();

router.get('/', async (req, res, next) => {
  try {
    const result = await eventsService.listEvents();
    res.json(result).status(200);
  } catch (err) { next(err) };
})

export default router;