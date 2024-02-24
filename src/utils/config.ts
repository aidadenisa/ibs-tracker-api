// @ts-expect-error TS(2792): Cannot find module 'dotenv'. Did you mean to set t... Remove this comment to see the full error message
import * as dotenv from 'dotenv';
// @ts-expect-error TS(2580): Cannot find name 'process'. Do you need to install... Remove this comment to see the full error message
dotenv.config({ path: `.env.${process.env.NODE_ENV}` });

// @ts-expect-error TS(2580): Cannot find name 'process'. Do you need to install... Remove this comment to see the full error message
const NODE_ENV = process.env.NODE_ENV;
// @ts-expect-error TS(2580): Cannot find name 'process'. Do you need to install... Remove this comment to see the full error message
const PORT = process.env.PORT;
// @ts-expect-error TS(2580): Cannot find name 'process'. Do you need to install... Remove this comment to see the full error message
const MONGODB_URI = process.env.NODE_ENV === 'test' 
  // @ts-expect-error TS(2580): Cannot find name 'process'. Do you need to install... Remove this comment to see the full error message
  ? process.env.TEST_MONGODB_URI
  // @ts-expect-error TS(2580): Cannot find name 'process'. Do you need to install... Remove this comment to see the full error message
  : process.env.MONGODB_URI
// @ts-expect-error TS(2580): Cannot find name 'process'. Do you need to install... Remove this comment to see the full error message
const SECRET = process.env.SECRET
// @ts-expect-error TS(2580): Cannot find name 'process'. Do you need to install... Remove this comment to see the full error message
const BREVO_API_KEY = process.env.BREVO_API_KEY;

export {
  NODE_ENV,
  PORT,
  MONGODB_URI,
  SECRET,
  BREVO_API_KEY,
}