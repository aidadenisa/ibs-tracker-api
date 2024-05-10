import app from '@/app'
import logger from '@/utils/logger'
import { PORT } from '@/utils/config'
import { connectDB } from '@/db/connection'

await connectDB()

app.listen(PORT, () => {
  logger.info(`Listening on port ${PORT}`)
})
