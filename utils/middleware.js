const logger = require('./logger');

const requestLogger = (request, response, next) => {
  logger.info('Method:', request.method);
  logger.info('Path:  ', request.path);
  logger.info('Body:  ', request.body);
  logger.info('---');
  next();
};

const unknownEndpoint = (request, response) => {
  response.status(404).send({ error: 'unknown endpoint' });
};

const errorHandler = (error, request, response, next) => {
  logger.error(error.message);

  if (error.name === 'CastError') {
    return response.status(400).send({ error: 'malformatted id' });
  } else if (error.name === 'ValidationError') {
    return response.status(400).json({ error: error.message });
  } else if (error.message === 'PassWordError') {
    return response.status(400).json({
      error:
        'Invalid Password, make sure the password has at least 3 characters',
    });
  } else if (error.message === 'AuthError') {
    return response.status(400).json({
      error: 'Invalid User or Password.',
    });
  } else if (
    error.message === 'InvalidToken' ||
    error.name === 'JsonWebTokenError'
  ) {
    return response.status(401).json({
      error: 'Invalid or Missing token',
    });
  } else if (error.message === 'BlogNotFound') {
    return response.status(404).json({ error: 'Blog Not Found' });
  }

  next(error);
};

const tokenExtractor = (request, reponse, next) => {
  const authorization = request.get('authorization');
  if (authorization && authorization.toLowerCase().startsWith('bearer ')) {
    request.token = authorization.substring(7);
  }
  next();
};

module.exports = {
  requestLogger,
  unknownEndpoint,
  errorHandler,
  tokenExtractor,
};
