// @ts-expect-error TS(2792): Cannot find module 'express'. Did you mean to set ... Remove this comment to see the full error message
import express from 'express';
// @ts-expect-error TS(2792): Cannot find module '../../services/events'. Did... Remove this comment to see the full error message
import eventsService from '../../services/events';

const router = express.Router();

router.get('/', async (req, res, next) => {
  try {
    const result = await eventsService.listEvents();
    res.json(result).status(200);
  } catch (err) { next(err) }
})

export default router;