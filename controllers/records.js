import express from 'express';
import recordsService from '../services/records.js';
import logger from '../utils/logger.js';

const router = express.Router();

// TODO: Replace this after adding auth with logged in user's credentials
router.get('/:userId', async (req, res, next) => {
  const result = await recordsService.listRecordsByUserId(req.params.userId, req.query.populate);
  logger.info(result)
  res.json(result);
});

router.post('/', async (req, res, next) => {
  const data = req.body;
  if(!data || !data.userId || !data.eventId) {
    return res.status(400).json({ error: 'Missing required properties: userId or eventId' })
  }
  const result = await recordsService.createNewRecord(data);
  res.json(result);
});

router.put('/:id', async (req, res, next) => {
  if(!req.body && !req.body.eventId) {
    res.status(400).json({ error: 'You need to specify an event for updating the record.' })
  }
  const result = await recordsService.updateRecordProperties(req.body);
  res.json(result);
})

router.delete('/:id', async (req, res, next) => {
  await recordsService.deleteRecord(req.params.id);
  res.status(204).end();
})

export default router;