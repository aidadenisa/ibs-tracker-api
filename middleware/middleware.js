import logger from '../utils/logger.js';

// Middleware that manages error handling in one place
// This is an Express error handler, that has 4 params
const errorHandler = (error, request, response, next) => {

  if(error.name === 'CastError') {
    return response.status(400).send({ error: 'Malformed id' });
  }
  
  if(error.message && error.message.match(/expected `email` to be unique/)) {
    return response.status(400).send({ error: 'The email address is already in use. Please use another one.'});
  }

  if(error.stack && error.stack.match(/ValidationError/)) {
    return response.status(400).send({ error: 'The data you send is not valid.'});
  }

  if(error.message && error.message.match(/User not found/)) {
    return response.status(404).send({ error: 'User not found.' });
  }

  if(error.message && error.message.match(/Invalid OTP/)) {
    return response.status(401).send({ error: 'Invalid OTP.'});
  }

  if(error.message && error.message.match(/OTP has expired/)) {
    return response.status(401).send({ error: 'OTP has expired.'});
  }

  if(error.name === 'TokenExpiredError') {
    return response.status(401).json({ error: 'Token expired.' });
  }
  
  if (error.name === 'JsonWebTokenError') {
    return response.status(401).json({ error: 'Invalid or missing JWT. Please log in again.'});
  }

  if (error) {
    return response.status(500).json({ error: 'Unexpected Error.' });
  }

  next(error);
}

const requestLogger = (request, response, next) => {
  logger.info('Method:', request.method)
  logger.info('Path:  ', request.path)
  logger.info('Body:  ', request.body)
  logger.info('---')
  next()
}

const unknownEndpoint = (request, response) => {
  return response.status(404).send({ error: 'unknown endpoint' })
}

export {
  errorHandler,
  requestLogger,
  unknownEndpoint,
};