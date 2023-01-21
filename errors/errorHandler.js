// Middleware that manages error handling in one place
// This is an Express error handler, that has 4 params
const errorHandler = (error, request, response, next) => {
  console.log(error.message);

  if(error.name === 'CastError') {
    return response.status(400).send({ error: 'Malformed id'});
  }

  next(error);
}

export default errorHandler;