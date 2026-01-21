import { Book } from '../models/book.ts'
import { ApiBook } from '../models/apiBook.ts'
import { BooksProvider } from './books.ts'

const booksProvider = (): BooksProvider => {
  const getBooks = async (): Promise<Book[]> => {
    try {
      const response = await fetch('https://6781684b85151f714b0aa5db.mockapi.io/api/v1/books')
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`)
      }
      
      const apiBooks: ApiBook[] = await response.json()
      
      // Mapear la respuesta de la API al formato de nuestro modelo Book
      return apiBooks.map(book => ({
        id: book.id.toString(), // Convertir id numérico a string
        name: book.name,
        author: book.author,
        unitsSold: book.units_sold, // Mapear units_sold a unitsSold
        price: book.price
      }))
    } catch (error) {
      console.error('Error fetching books:', error)
      // Retornar array vacío en caso de error (o podrías lanzar el error)
      return []
    }
  }

  return {
    getBooks,
  }
}

export default booksProvider
