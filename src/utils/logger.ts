import { createLogger, transports, format } from 'winston';

const logger = createLogger({
  level: 'info',
  format: format.combine(
    format.timestamp(), // adds a timestamp property
    format.json()
  ),
  //logger method...
  transports: [
    //new transports:
    new transports.File({
      filename: './logs/app.log',
      level: 'info',
      maxsize: 1000000, //1mb
    }),
    new transports.File({
      filename: './logs/error.log',
      level: 'error',
      handleExceptions: true,
      handleRejections: true,
      maxsize: 5242880, //5mb
    })
  ],
});

const info = (...params: string[]) => {
  const [message, ...meta] = params;
  if (process.env.NODE_ENV !== 'production') {
    console.log(...params);
  } else {
    logger.info(message, ...meta);
  }
}


const error = (...params: string[]) => {
  const [message, ...meta] = params;
  if (process.env.NODE_ENV !== 'production') {
    console.error(...params)
  } else {
    logger.error(message, ...meta);
  }
}

export default {
  info,
  error,
}