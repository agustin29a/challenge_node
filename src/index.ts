import express from 'express'
import cors from 'cors'
import BooksProvider from './providers/booksProvider'
import MetricsHandler from './handlers/metrics'
import { MetricsService } from './services/metricsService'

const app = express()
const PORT = 3001

app.use(express.json())
app.use(cors())

const booksProvider = BooksProvider()
const metricsService = new MetricsService()
const metricsHandler = MetricsHandler(booksProvider, metricsService)

app.get('/', metricsHandler.get)

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})

export { app }