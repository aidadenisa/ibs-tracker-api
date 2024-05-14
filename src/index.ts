import app from '@/app'
import logger from '@/utils/logger'
import { PORT } from '@/infra/config/config'
import { connectDB } from '@/infra/db/connection'

await connectDB()

app.listen(PORT, () => {
  logger.info(`Listening on port ${PORT}`)
})

process.on('uncaughtException', function (err) {
  console.error(err.stack)
  console.log('Node NOT Exiting...')
})
