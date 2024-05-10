import { rateLimit } from 'express-rate-limit'

// Set up rate limiter for login endpoints
const loginLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 5, // Limit each IP to 5 requests per windowMs
  message: 'Too many login attempts, please try again later.',
});

// Set up rate limiter for login endpoints
const otpValidationLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 10, // Limit each IP to 5 requests per windowMs
  message: 'Too many OTP validation attempts, please try again later.',
});

export {
  loginLimiter,
  otpValidationLimiter,
}