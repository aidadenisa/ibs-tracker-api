import logger from './logger.js';

// Middleware that manages error handling in one place
// This is an Express error handler, that has 4 params
const errorHandler = (error, request, response, next) => {
  logger.error(error.message);

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

  if(error.message && error.message.match(/Invalid email or password/)) {
    return response.status(401).send({ error: 'Invalid email or password.'});
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
  response.status(404).send({ error: 'unknown endpoint' })
}

export {
  errorHandler,
  requestLogger,
  unknownEndpoint,
};