import express from 'express';
import recordsService from '../services/records.js';
import logger from '../utils/logger.js';

const router = express.Router();

router.get('/', async (req, res, next) => {
  try {
    const result = await recordsService
      .listRecordsByUserId(req.user.id, req.query.populate);
    logger.info(result)
    res.json(result);
  } catch (err) { next(err) };
});

router.post('/', async (req, res, next) => {
  const data = req.body;
  if (!data || !data.eventId) {
    return res.status(400).json({ error: 'Missing required properties: eventId' })
  }
  try {
    const result = await recordsService.createNewRecord(data, req.user);
    res.json(result);
  } catch (err) { next(err) };
});

router.post('/multiple', async (req, res, next) => {
  const data = req.body;
  if (!data || !data.dateISO || !data.selectedEventsIds) {
    return res.status(400).json({ error: 'Missing required properties: dateISO or selectedEventsIds'})
  }
  try {
    const result = await recordsService.updateRecordsForDate(req.user.id, data.dateISO, data.selectedEventsIds);
    return res.json(result);
  } catch (err) { next(err) };
})

router.put('/:id', async (req, res, next) => {
  if (!req.body && !req.body.eventId) {
    return res.status(400).json({ error: 'You need to specify an event for updating the record.' })
  }
  try {
    const result = await recordsService.updateRecordProperties(req.params.id, req.body);
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