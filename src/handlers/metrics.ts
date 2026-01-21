import { Request, Response } from 'express'
import { BooksProvider } from '../providers/books'
import { MetricsResponse } from '../models/metrics'
import { MetricsService } from '../services/metricsService'

interface GetMetricsQuery {
  author?: string
}

const metricsHandler = (metricsProvider: BooksProvider, metricsService: MetricsService) => {
  const get = async (
    req: Request<{}, {}, {}, GetMetricsQuery>,
    res: Response<MetricsResponse>
  ): Promise<void> => {
    try {
      const { author } = req.query
      const books = await metricsProvider.getBooks()

      const metrics = metricsService.calculateMetrics(books, author)

      res.status(200).json(metrics)
    } catch (error) {
      console.error('Error calculating metrics:', error)
      res.status(500).json({
        mean_units_sold: 0,
        cheapest_book: null,
        books_written_by_author: []
      } as MetricsResponse)
    }
  }

  return {
    get,
  }
}

export default metricsHandler