import express from 'express';
import userService from '../services/users.js';

const router = express.Router();

router.get('/:id', async (req, res, next) => {
  try {
    const result = await userService.getUserById(req.params.id);
    res.json(result);
  } catch(err) { next(err) };
});

router.post('/', async (req, res, next) => {
  const data = req.body;
  if(!data.email) {
    res.status(400).json({ error: 'You need to specify an email for the user' });
  }
  try {
    const result = await userService.createNewUser(data);
    res.json(result);
  } catch(err) { next(err) };
});

export default router;