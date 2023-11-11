import { IMPORT_FROM_BOWELLE } from '../utils/config.js'
import importService from '../services/import.js'
import express from 'express';

const router = express.Router();

router.post('/', async (req, res, next) => {
  const data = req.body;
  if (!data || !data.length) {
    return res.status(400).json({ error: 'Missing required properties: eventId' })
  }
  try {
    if(req.query.bowelle === 'true') {
      const result = await importService.importData(IMPORT_FROM_BOWELLE, req.user.id, data);
      return res.json(result);
    }
    return res.json({})
  } catch (err) { next(err) };
});

export default router;