import { Book } from '../model/book';
import bookDb from '../repository/book.db';

const getAllBooks = (): Book[] => {
    return bookDb.getAllBooks();
};

const getBookById = (bookId: number): Book => {
    const book = bookDb.findBookById(bookId);
    if (!book) {
        throw new Error("Book with this id does not exist!");
    }
    return book;
}


export default { getAllBooks, getBookById,};
