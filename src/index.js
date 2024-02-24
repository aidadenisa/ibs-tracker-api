import app from './app.js';
import logger from './utils/logger.js';
import { PORT } from './utils/config.js';

app.listen(PORT, () => {
  logger.info(`Listening on port ${PORT}`);
})