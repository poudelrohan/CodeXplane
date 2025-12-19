
//import dotenv from "dotenv"
import express from "express"
import cors from 'cors'
import helmet, { contentSecurityPolicy } from 'helmet'
import rateLimit from "express-rate-limit"
import { OpenAI } from "openai/client.js"

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
app.use(limiter)

app.use(express.json({limit: '10mb'}))


const API_KEY = procees.env.NEBIUS_API_KEY
const client = new OpenAI({
    baseURL: 'https://api.tokenfactory.nebius.com/v1/',
    apiKey: API_KEY,
});

app.post("/api/explain-code", async(req, res) =>{
    try {
        const {code, language} = req.body

        if(!code){
            return res.status(400).json({error:"Code is required"})
        }

        const messages = [
            {
                role: 'user',
                content: `Please explain this ${language || ""} code in simple terms:\n\n\`\`\`${language || ""}\n${code}\n\`\`\``

            }
        ]
        const response = await client.chat.completions.create({
            model: "openai/gpt-oss-120b",
            messages,
            temperature: 0.3,
            max_completion_tokens: 800,
        })

        const explaination = response?.choices[0]?.message?.content
        if(!explaination){
            return res.status(500).json({error: "Failed to explain code"})
        }

        res.json({explaination, language: language || "unknown"})
        
    } catch (error) {
        console.error("Code Expalin API Error", err)
        res.status(500).json({error:"Server error", details: err.message})
        
    }
    
})

const PORT = procees.env.PORT || 3002

app.listen(PORT, () =>{
    console.log(`API server listening on http://localhost:${PORT}`)
} )