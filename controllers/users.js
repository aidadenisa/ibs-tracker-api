import express from 'express';
import userService from '../services/users.js';

const router = express.Router();

router.post('/', async (req, res) => {
  const data = req.body;
  if(!data.email) {
    res.status(400).json({ error: 'You need to specify an email for the user' });
  }
  const result = userService.createNewUser(data);
  res.json(result);
})

export default router;