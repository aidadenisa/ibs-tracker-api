import express from 'express';
import authService from '../services/auth.js';

const router = express.Router();

router.post('/login', async (req, res, next) => {
  const { email, pass } = req.body;
  if(!email || !pass) {
    return res.status(400).json({ error: 'Email and password required.'});
  }
  try {
    const result = await authService.login(email, pass);
    res.json(result);
  } catch(err) { next(err) };
});

router.post('/signup', async (req, res, next) => {
  const data = req.body;
  if(!data.email) {
    return res.status(400).json({ error: 'You need to specify an email for the user' });
  }
  try {
    const result = await authService.signup(data);
    res.json(result);
  } catch(err) { next(err) };
});


export default router;