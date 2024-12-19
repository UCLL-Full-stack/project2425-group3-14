import { Book } from '../model/book';
import bookDb from '../repository/book.db';
import { BookInput } from '../types';

const getAllBooks = async (): Promise<Book[]> => {
    return await bookDb.getAllBooks();
};

const getBookById = async (bookId: number): Promise<Book> => {
    const book = await bookDb.findBookById(bookId);
    if (!book) {
        throw new Error("Book with this id does not exist!");
    }
    return await book;
}

const addBook = async ({name, author, genres, quantity, price, imageUrl}: BookInput): Promise<Book> => {
    const book = new Book({name, author, genres, quantity, price, imageUrl});
    return await bookDb.addBook(book);
}

const removeBook = async (id): Promise<Book> => {
    const book = await bookDb.removeBook(id);

    if (!book) {
        throw new Error("User with this id does not exist.")
    }

    return await bookDb.removeBook(id);
}


export default { getAllBooks, getBookById, addBook, removeBook,};
