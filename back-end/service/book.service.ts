import { Book } from '../model/book';
import bookDb from '../repository/book.db';

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


export default { getAllBooks, getBookById,};
