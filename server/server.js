import "dotenv/config"
import express from "express"
import cors from 'cors'
import helmet from 'helmet'
import rateLimit from "express-rate-limit"


const app = express()

app.use(helmet())

app.use(
    cors({
        origin: process.env.FRONTEND_URL || "http://localhost:3000",
        credentials: true
    })
)


const limiter = rateLimit({
    windowMs: 15 * 60 * 1000,
    max: 100,
    message: "Too many requests from this IP, Try again later."
})
app.use(limiter
)

app.use(express.json({limit: '100mb'}))