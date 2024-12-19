import { Book } from '../model/book';
import { BookInput } from '../types';

import database from './database';

const books = [
    new Book({
        id: 1,
        name: 'Book 1',
        quantity: 5,
        author: 'John',
        genres: ['Fantasy', 'Adventure'],
        price: 15,
        imageUrl: "/Book1.png",
    }),
    new Book({
        id: 2,
        name: 'Book 2',
        quantity: 8,
        author: 'Jeff',
        genres: ['Action', 'Fiction'],
        price: 10,
        imageUrl: "/Book2.png",
    })
];
const getAllBooks = async (): Promise<Book[]> => {
    try {
        const bookPrisma = await database.book.findMany({
            include: { cartItem: true }, 
        });
        return bookPrisma.map((bookPrisma) => Book.from(bookPrisma));
    } catch (error) {
        console.error(error);
        throw new Error('Database error. See server log for details.')
    }
}

// const getAllBooks = (): Book[] => {
//     return books;
// };

const findBookById = async (id: number): Promise<Book | undefined>=> {
    try {
        const bookPrisma = await database.book.findUnique({
            where: { id },
        });
        return bookPrisma ? Book.from(bookPrisma) : undefined;
    } catch (error) {
        console.error(error);
        throw new Error('Database error. See server log for details');
    }        
};

const addBook = async ({name, author, genres, quantity, price, imageUrl }: BookInput): Promise<Book> => {
    try {
        const bookPrisma = await database.book.create({
            data: {
                name,
                author,
                genres,
                quantity,
                price,
                imageUrl,
            }
        });
        return Book.from(bookPrisma);       
    } catch (error) {
        console.error(error);
    }
}

const removeBook = async (id: number): Promise<Book> => {
    try {
        const book = await database.book.findUnique({
            where: { id },
            include: { cartItem: true}
        });

        if (book == undefined) {
            throw new Error(`Book with id ${id} was not found.`);
        }
        
        await database.book.delete({
            where: { id },
        });
        
        return Book.from(book);
    } catch (error) {
        console.error(error);
        throw new Error('Database error. See server log for details.')
    }
}



export default { getAllBooks, findBookById, addBook, removeBook };
