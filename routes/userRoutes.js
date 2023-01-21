import express from 'express';
import { User } from '../db/schemas.js';

const router = express.Router();

router.post('/', async (req, res) => {
  const data = req.body;
  if(!data.email) {
    res.status(400).json({error: 'You need to specify an email for the user'});
  }

  const newUser = new User({
    firstName: data.firstName,
    lastName: data.lastName,
    email: data.email,
    hash: data.hash,
    hasMenstruationSupport: data.hasMenstruationSupport,
    registeredOn: new Date(),
  });

  const result = await newUser.save();
  console.log(result);
  res.json(result);
})

export default router;