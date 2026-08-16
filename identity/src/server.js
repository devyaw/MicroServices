import "dotenv/config"
import express from "express"
import helmet from "helmet"
import connectDb from './Database/db.js'
import errorHandler from './Middleware/errorHandler.js'
import cors from 'cors'
import { rateLimit } from 'express-rate-limit'
import ioredis from 'ioredis'
import redisStore from 'rate-limit-redis'
import { RateLimiterMemory } from 'rate-limiter-flexible'
import userRoutes from './Routes/user-routes.js'


const app = express()

const redisClient = new ioredis(process.env.REDISURL)

redisClient.on('error', (err) => {
  console.error('Redis connection error:', err.message);
});

redisClient.on('connect', () => {
  console.log('Redis connected successfully');
});

redisClient.on('ready', () => {
  console.log('Redis ready');
});

const limiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  limit: 20,
  standardHeaders: 'draft-7',
  legacyHeaders: false,
  handler: (req, res, next) => {
    res.status(429).json({
      message: `Too many requests from ${req.ip} to ${req.originalUrl}`,
    })
  },
  store: new redisStore({
    sendCommand: (...args) => redisClient.call(...args),
  }),
})

const rateLimiterRedisInstance = new RateLimiterMemory({
  storeClient: redisClient,
  keyPrefix: 'rate-limit',
  points: 10,
  duration: 20,
  blockDuration: 60,
})

app.use(express.json())
app.use(helmet())
app.use(cors())
app.use(limiter)
app.use(errorHandler)
app.use((req, res, next) => {
  rateLimiterRedisInstance.consume(req.ip)
    .then(() => next())
    .catch(() => res.status(429).json({ message: `Too many requests from ${req.ip} to ${req.originalUrl}` }))
})
app.use((req, res, next) => {
  req.redisClient = redisClient
  next()
})

connectDb()

app.use('/api/auth', userRoutes)


const port = process.env.PORT

app.listen(port, () => {
    console.log(`Server is running on port ${port}`)
})
