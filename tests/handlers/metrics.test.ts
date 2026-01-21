import { describe, it, expect, beforeEach } from 'vitest'
import { MetricsService } from '../../src/services/metricsService'
import { Book } from '../../src/models/book'

describe('MetricsService', () => {
  let metricsService: MetricsService
  let mockBooks: Book[]

  beforeEach(() => {
    metricsService = new MetricsService()
    mockBooks = [
      { id: '1', name: 'Book 1', author: 'Author 1', unitsSold: 100, price: 20 },
      { id: '2', name: 'Book 2', author: 'Author 2', unitsSold: 200, price: 15 },
      { id: '3', name: 'Book 3', author: 'Author 1', unitsSold: 300, price: 25 }
    ]
  })

  describe('calculateMeanUnitsSold', () => {
    it('should calculate correct mean for multiple books', () => {
      const mean = metricsService.calculateMeanUnitsSold(mockBooks)
      expect(mean).toBe(200)
    })

    it('should return 0 for empty array', () => {
      const mean = metricsService.calculateMeanUnitsSold([])
      expect(mean).toBe(0)
    })

    it('should handle single book', () => {
      const mean = metricsService.calculateMeanUnitsSold([mockBooks[0]])
      expect(mean).toBe(100)
    })

    it('should handle books with zero units sold', () => {
      const booksWithZero: Book[] = [
        { id: '1', name: 'Book 1', author: 'Author 1', unitsSold: 0, price: 20 },
        { id: '2', name: 'Book 2', author: 'Author 2', unitsSold: 100, price: 15 }
      ]
      const mean = metricsService.calculateMeanUnitsSold(booksWithZero)
      expect(mean).toBe(50)
    })
  })

  describe('findCheapestBook', () => {
    it('should find the cheapest book', () => {
      const cheapest = metricsService.findCheapestBook(mockBooks)
      expect(cheapest).toEqual(mockBooks[1])
    })

    it('should return null for empty array', () => {
      const cheapest = metricsService.findCheapestBook([])
      expect(cheapest).toBeNull()
    })

    it('should return the only book when array has one element', () => {
      const cheapest = metricsService.findCheapestBook([mockBooks[0]])
      expect(cheapest).toEqual(mockBooks[0])
    })

    it('should return first book when all have same price', () => {
      const samePriceBooks: Book[] = [
        { id: '1', name: 'Book 1', author: 'Author 1', unitsSold: 100, price: 20 },
        { id: '2', name: 'Book 2', author: 'Author 2', unitsSold: 200, price: 20 },
        { id: '3', name: 'Book 3', author: 'Author 3', unitsSold: 300, price: 20 }
      ]
      const cheapest = metricsService.findCheapestBook(samePriceBooks)
      expect(cheapest).toEqual(samePriceBooks[0])
    })

    it('should handle books with decimal prices', () => {
      const decimalPriceBooks: Book[] = [
        { id: '1', name: 'Book 1', author: 'Author 1', unitsSold: 100, price: 20.99 },
        { id: '2', name: 'Book 2', author: 'Author 2', unitsSold: 200, price: 15.50 },
        { id: '3', name: 'Book 3', author: 'Author 3', unitsSold: 300, price: 15.49 }
      ]
      const cheapest = metricsService.findCheapestBook(decimalPriceBooks)
      expect(cheapest).toEqual(decimalPriceBooks[2])
    })
  })

  describe('filterBooksByAuthor', () => {
    it('should filter books by exact author name', () => {
      const filtered = metricsService.filterBooksByAuthor(mockBooks, 'Author 1')
      expect(filtered).toHaveLength(2)
      expect(filtered).toEqual([mockBooks[0], mockBooks[2]])
    })

    it('should be case insensitive', () => {
      const filtered = metricsService.filterBooksByAuthor(mockBooks, 'AUTHOR 1')
      expect(filtered).toHaveLength(2)
      expect(filtered).toEqual([mockBooks[0], mockBooks[2]])
    })

    it('should return empty array when no books match', () => {
      const filtered = metricsService.filterBooksByAuthor(mockBooks, 'Author 3')
      expect(filtered).toHaveLength(0)
    })

    it('should handle whitespace in author name', () => {
      const booksWithSpaces: Book[] = [
        { id: '1', name: 'Book 1', author: ' Author 1 ', unitsSold: 100, price: 20 }
      ]
      const filtered = metricsService.filterBooksByAuthor(booksWithSpaces, 'Author 1')
      expect(filtered).toHaveLength(1)
    })

    it('should return empty array for empty books array', () => {
      const filtered = metricsService.filterBooksByAuthor([], 'Author 1')
      expect(filtered).toHaveLength(0)
    })
  })

  describe('calculateMetrics', () => {
    it('should calculate all metrics without author filter', () => {
      const metrics = metricsService.calculateMetrics(mockBooks)
      
      expect(metrics.mean_units_sold).toBe(200)
      expect(metrics.cheapest_book).toEqual(mockBooks[1])
      expect(metrics.books_written_by_author).toEqual([])
    })

    it('should calculate all metrics with author filter', () => {
      const metrics = metricsService.calculateMetrics(mockBooks, 'Author 1')
      
      expect(metrics.mean_units_sold).toBe(200)
      expect(metrics.cheapest_book).toEqual(mockBooks[1])
      expect(metrics.books_written_by_author).toEqual([mockBooks[0], mockBooks[2]])
    })

    it('should handle empty books array', () => {
      const metrics = metricsService.calculateMetrics([])
      
      expect(metrics.mean_units_sold).toBe(0)
      expect(metrics.cheapest_book).toBeNull()
      expect(metrics.books_written_by_author).toEqual([])
    })

    it('should handle empty books array with author filter', () => {
      const metrics = metricsService.calculateMetrics([], 'Author 1')
      
      expect(metrics.mean_units_sold).toBe(0)
      expect(metrics.cheapest_book).toBeNull()
      expect(metrics.books_written_by_author).toEqual([])
    })
  })
})