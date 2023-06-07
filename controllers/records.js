import express from 'express';
import recordsService from '../services/records.js';
import logger from '../utils/logger.js';

const router = express.Router();

// TODO: Replace this after adding auth with logged in user's credentials
router.get('/:userId', async (req, res, next) => {
  try {
    const result = await recordsService
      .listRecordsByUserId(req.params.userId, req.query.populate);
    logger.info(result)
    res.json(result);
  } catch (err) { next(err) };
});

router.post('/', async (req, res, next) => {
  const data = req.body;
  if (!data || !data.userId || !data.eventId) {
    return res.status(400).json({ error: 'Missing required properties: userId or eventId' })
  }
  try {
    const result = await recordsService.createNewRecord(data);
    res.json(result);
  } catch (err) { next(err) };
});

router.put('/:id', async (req, res, next) => {
  if (!req.body && !req.body.eventId) {
    res.status(400).json({ error: 'You need to specify an event for updating the record.' })
  }
  try {
    const result = await recordsService.updateRecordProperties(req.body);
    res.json(result);
  } catch (err) { next(err) };
})

router.delete('/:id', async (req, res, next) => {
  try {
    await recordsService.deleteRecord(req.params.id);
    res.status(204).end();
  } catch (err) { next(err) };
})

export default router;