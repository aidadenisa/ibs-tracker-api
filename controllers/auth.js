import express from 'express';
import authService from '../services/auth.js';
import { loginLimiter, otpValidationLimiter } from '../middleware/rateLimiter.js';

const router = express.Router();

router.post('/login', loginLimiter, async (req, res, next) => {
  const { email } = req.body;
  if(!email) {
    return res.status(400).json({ error: 'Email and password required.'});
  }
  try {
    await authService.login(email);
    res.status(200).send();
  } catch(err) { next(err) };
});

router.post('/signup', loginLimiter, async (req, res, next) => {
  const data = req.body;
  if(!data.email) {
    return res.status(400).json({ error: 'You need to specify an email for the user' });
  }
  try {
    const result = await authService.signup(data);
    res.status(201).json(result);
  } catch(err) { next(err) };
});

router.post('/validate-otp', otpValidationLimiter, async (req, res, next) => {
  const { email, otp } = req.body;
  if(!email || !otp) {
    return res.status(400).json({ error: 'Email and otp required.'});
  }
  try {
    const result = await authService.validateOTP(email, otp);
    res.json(result);
  } catch(err) { next(err) };
});

export default router;