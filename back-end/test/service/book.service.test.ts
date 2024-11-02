import { Book } from '../../model/book';
import bookDb from '../../repository/book.db';
import bookService from '../../service/book.service';

const bookData = {
    id: 1,
    name: 'Book 1',
    quantity: 10,
    author: 'Jeff',
    genres: ['Horror'],
    price: 20,
    imageUrl: '/Book2.png',
};

const book = new Book(bookData);

let mockBookDbGetAllBooks: jest.Mock;
let mockBookDbFindBookById: jest.Mock;

beforeEach(() => {
    mockBookDbGetAllBooks = jest.fn();
    mockBookDbFindBookById = jest.fn();

    bookDb.getAllBooks = mockBookDbGetAllBooks;
    bookDb.findBookById = mockBookDbFindBookById;
});

afterEach(() => {
    jest.clearAllMocks();
});

test('given a call to getAllBooks, when books exist, then it returns all books', () => {
    // given
    mockBookDbGetAllBooks.mockReturnValue([book]);

    // when
    const result = bookService.getAllBooks();

    // then
    expect(mockBookDbGetAllBooks).toHaveBeenCalledTimes(1);
    expect(result).toEqual([book]);
});

test('given a call to getBookById with a valid ID, when book exists, then it returns the book', () => {
    // given
    const bookId = 1;
    mockBookDbFindBookById.mockReturnValue(book);

    // when
    const result = bookService.getBookById(bookId);

    // then
    expect(mockBookDbFindBookById).toHaveBeenCalledTimes(1);
    expect(mockBookDbFindBookById).toHaveBeenCalledWith(bookId);
    expect(result).toEqual(book);
});

test('given a call to getBookById with an invalid ID, when book does not exist, then an error is thrown', () => {
    // given
    const invalidBookId = 999;
    mockBookDbFindBookById.mockReturnValue(undefined);

    // when
    const getBookByInvalidId = () => bookService.getBookById(invalidBookId);

    // then
    expect(getBookByInvalidId).toThrow("Book with this id does not exist!");
});
