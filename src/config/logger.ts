import winston, { format, Logger } from 'winston';

const { combine } = format;

const logger: Logger = winston.createLogger({
  levels: winston.config.npm.levels,
  level: process.env.LOG_LEVEL || 'info',
  format: combine(
    winston.format.colorize(),
    winston.format.simple()
  ),
  transports: [new winston.transports.Console()],
});

export default logger;
