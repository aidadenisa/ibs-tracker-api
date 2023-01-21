import logger from './logger.js';

// Middleware that manages error handling in one place
// This is an Express error handler, that has 4 params
const errorHandler = (error, request, response, next) => {
  logger.error(error.message);

  if(error.name === 'CastError') {
    return response.status(400).send({ error: 'Malformed id' });
  }
  logger.error('again');
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
  response.status(404).send({ error: 'unknown endpoint' })
}

export {
  errorHandler,
  requestLogger,
  unknownEndpoint,
};