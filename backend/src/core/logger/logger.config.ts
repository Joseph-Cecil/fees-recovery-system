/**
 * Logger configuration
 */
export const loggerConfig = {
  level: process.env.LOG_LEVEL || 'info',
  format: process.env.LOG_FORMAT || 'pretty',
  fileEnabled: process.env.LOG_FILE_ENABLED === 'true',
  filePath: process.env.LOG_FILE_PATH || './logs/app.log',
};

