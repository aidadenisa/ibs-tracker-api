// @ts-expect-error TS(2792): Cannot find module 'winston'. Did you mean to set ... Remove this comment to see the full error message
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

const info = (...params) => {
  // @ts-expect-error TS(2580): Cannot find name 'process'. Do you need to install... Remove this comment to see the full error message
  if (process.env.NODE_ENV !== 'production') { 
    console.log(...params);
  } else {
    logger.info(...params);
  }
}

const error = (...params) => {
  // @ts-expect-error TS(2580): Cannot find name 'process'. Do you need to install... Remove this comment to see the full error message
  if (process.env.NODE_ENV !== 'production') { 
    console.error(...params)
  } else {
    logger.error(...params);
  }
}

export default {
  info, 
  error,
}