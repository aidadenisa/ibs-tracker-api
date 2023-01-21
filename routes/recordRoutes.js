import express, { response } from 'express';
import { Record } from '../db/schemas.js';
import mongoose from 'mongoose';
const router = express.Router();

// TODO: Replace this after adding auth with logged in user's credentials
router.get('/:userId', async (req, res, next) => {
  const result = await Record.find({user: req.params.userId})
    // .catch(error => {
    //   console.log(error);
    //   res.status(500).json({ error: 'There was an error getting the events. Please try again.'})
    // })
    // * Manage errors in a middleware that runs AFTER this function
      .catch(error => next(error));

  res.json(result);
});

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

router.put('/:id', async (req, res, next) => {
  if(!req.body && !req.body.eventId) {
    res.status(400).json({ error: 'You need to specify an event for updating the record.'})
  }
  const updatedEventProperties = {
    event: req.body.eventId
  }
  // new: true -> Helps in returning the updated object as result
  const result = await Record.findByIdAndUpdate(req.params.id, updatedEventProperties, {new: true})
    .catch(error => next(error));

  res.json(result);
})

router.delete('/:id', async (req, res, next) => {
  const result = await Record.findByIdAndDelete(req.params.id)
    .catch(error => next(error))
  res.status(204).end();
})

export default router;