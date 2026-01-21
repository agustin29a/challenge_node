import { Book } from '../models/book'
import { MetricsResponse } from '../models/metrics'

export class MetricsService {
  calculateMeanUnitsSold(books: Book[]): number {
    if (books.length === 0) return 0
    const totalUnitsSold = books.reduce((sum, book) => sum + book.unitsSold, 0)
    return totalUnitsSold / books.length
  }

  findCheapestBook(books: Book[]): Book | null {
    if (books.length === 0) return null
    return books.reduce((cheapest, book) => {
      return book.price < cheapest.price ? book : cheapest
    }, books[0])
  }

  filterBooksByAuthor(books: Book[], author: string): Book[] {
    const normalizedAuthor = author.toLowerCase().trim()
    return books.filter(book => book.author.toLowerCase().trim() === normalizedAuthor)
  }

  calculateMetrics(books: Book[], author?: string): MetricsResponse {
    return {
      mean_units_sold: this.calculateMeanUnitsSold(books),
      cheapest_book: this.findCheapestBook(books),
      books_written_by_author: author ? this.filterBooksByAuthor(books, author) : []
    }
  }
}