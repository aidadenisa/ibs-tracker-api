import express, { response } from 'express';
import { Record } from '../db/schemas.js';
import mongoose from 'mongoose';
const router = express.Router();

router.post('/', async (req, res) => {
  const data = req.body;
  if(!data || !data.userId || !data.eventId) {
    return res.status(400).json({ error: 'Missing required properties: userId or eventId'})
  }
  
  const newRecord = new Record({
    date: new Date(),
    user: mongoose.Types.ObjectId(data.userId),
    event: mongoose.Types.ObjectId(data.eventId),
  });

  const result = await newRecord.save();
  console.log(result);
  res.json(result);
});

export default router;