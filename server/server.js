import express from 'express'
import { fileURLToPath } from 'url'
import path from 'path'
import dotenv from 'dotenv'
import { GoogleGenerativeAI } from '@google/generative-ai'
dotenv.config()
const port = process.env.PORT
const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)
const API_KEY = process.env.GOOGLE_API_KEY
const genAI = new GoogleGenerativeAI(API_KEY)
const model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' })
const app = express()
app.use(express.static(path.join(__dirname, '..', 'client', 'dist')))
app.use(express.json())
app.get('*', (req, res) => res.sendFile(path.resolve(__dirname, '..', 'client', 'dist', 'index.html')))
app.post('/generate-content', async (req, res) => {
  const { prompt } = req.body
  
  try {
    const result = await model.generateContent(prompt)
    res.json({ response: result.response.text() })
    console.log(result)
  } catch (error) {
    console.error('Error generating content:', error)
    res.status(500).json({ error: 'Failed to generate content' })
  }
});

app.listen(port, () => {
  console.log(`Server is running on port ${port}`)
});