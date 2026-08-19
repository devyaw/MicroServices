import winston from 'winston'


const logger = winston.createLogger({
  level: 'info',
  format: winston.format.combine(
    winston.format.timestamp(),
    winston.format.json(),
    winston.format.colorize(),
    winston.format.printf(({ timestamp, level, message }) => {
      return `${timestamp} [${level}]: ${message}`
    }),
    winston.format.errors({ stack: true }),
  ),
  transports: [
    new winston.transports.Console(
      winston.format.colorize(),
      winston.format.simple(),

    ),
    new winston.transports.File({ filename: 'logs/error.log', level: 'error' }),
    new winston.transports.File({ filename: 'logs/combined.log' }),
  ],
})

export default logger
