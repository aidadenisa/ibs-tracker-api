import * as dotenv from 'dotenv'
dotenv.config({ path: `.env.${process.env.NODE_ENV}` })

const NODE_ENV = process.env.NODE_ENV
const PORT = process.env.PORT
const MONGODB_URI = process.env.MONGODB_URI
const TEST_MONGODB_URI = process.env.TEST_MONGODB_URI
const SECRET = process.env.SECRET
const BREVO_API_KEY = process.env.BREVO_API_KEY

export { NODE_ENV, PORT, MONGODB_URI, TEST_MONGODB_URI, SECRET, BREVO_API_KEY }
