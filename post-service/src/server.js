import "dotenv/config"
import express from "express"
import helmet from "helmet"
import cors from "cors"
import ioredis from "ioredis"
import { rateLimit } from "express-rate-limit"
import RedisStore from "rate-limit-redis"
import { RateLimiterMemory } from "rate-limiter-flexible";
import connectMongoDB from "./Database/mongo-db.js"



const app = express()

const redisClient = new ioredis(process.env.REDISURL)

redisClient.on("error", (err) => {
    console.error("Redis error:", err)
})

redisClient.on("connect", () => {
    console.log("Redis is connecting")
})

redisClient.on("ready", () => {
    console.log("Redis is ready")
})

const limiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  limit: 20,
  standardHeaders: "draft-7",
  legacyHeaders: false,
  handler: (req, res) => {
    res.status(429).json({
      error: "Too many requests",
      message: `You have exceeded the rate limit of 20 requests per 15 minutes from ${req.ip} to ${req.url}`,
    })
  },
  store: new RedisStore({
    sendCommand: (...args) => redisClient.call(...args),
  }),
})

const memoryLimiter = new RateLimiterMemory({
  storeClient: redisClient,
  keyPrefix: "redis",
  points: 20,
  duration: 15 * 60,
})

app.use(express.json())
app.use(helmet())
app.use(cors())
app.use(limiter)
app.use((req, res, next) => {
  memoryLimiter.consume(req.ip).then(() => {
    next()
  }).catch(() => {
    res.status(429).json({
      error: "Too many requests",
      message: `You have exceeded the rate limit of 20 requests per 15 minutes from ${req.ip} to ${req.url}`,
    })
  })
})
app.use((req, res, next) => {
  req.redisClient = redisClient
  next()
})

connectMongoDB()



const PORT = process.env.PORT

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`)
})
