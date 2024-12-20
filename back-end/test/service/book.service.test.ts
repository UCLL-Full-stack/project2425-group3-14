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
let mockBookDbAddBook: jest.Mock;
let mockBookDbRemoveBook: jest.Mock;

beforeEach(() => {
    mockBookDbGetAllBooks = jest.fn();
    mockBookDbFindBookById = jest.fn();
    mockBookDbAddBook = jest.fn();
    mockBookDbRemoveBook = jest.fn();

    // Mocking the methods of the bookDb module
    bookDb.getAllBooks = mockBookDbGetAllBooks;
    bookDb.findBookById = mockBookDbFindBookById;
    bookDb.addBook = mockBookDbAddBook;
    bookDb.removeBook = mockBookDbRemoveBook;
});

afterEach(() => {
    jest.clearAllMocks();
});

test('given a call to getAllBooks, when books exist, then it returns all books', async () => {
    // given
    mockBookDbGetAllBooks.mockResolvedValue([book]);

    // when
    const result = await bookService.getAllBooks();

    // then
    expect(mockBookDbGetAllBooks).toHaveBeenCalledTimes(1);
    expect(result).toEqual([book]);
});

test('given a call to getBookById with a valid ID, when book exists, then it returns the book', async () => {
    // given
    const bookId = 1;
    mockBookDbFindBookById.mockResolvedValue(book);

    // when
    const result = await bookService.getBookById(bookId);

    // then
    expect(mockBookDbFindBookById).toHaveBeenCalledTimes(1);
    expect(mockBookDbFindBookById).toHaveBeenCalledWith(bookId);
    expect(result).toEqual(book);
});

test('given a call to getBookById with an invalid ID, when book does not exist, then an error is thrown', async () => {
    // given
    const invalidBookId = 999;
    mockBookDbFindBookById.mockResolvedValue(undefined);

    // when
    const getBookByInvalidId = () => bookService.getBookById(invalidBookId);

    // then
    await expect(getBookByInvalidId()).rejects.toThrow("Book with this id does not exist!");
});

test('given a call to addBook, when the book is valid, then it returns the added book', async () => {
    // given
    const bookInput = {
        name: 'New Book',
        author: 'Author 2',
        genres: ['Thriller'],
        quantity: 5,
        price: 15,
        imageUrl: '/newbook.png',
    };

    mockBookDbAddBook.mockResolvedValue(new Book(bookInput));

    // when
    const result = await bookService.addBook(bookInput);

    // then
    expect(mockBookDbAddBook).toHaveBeenCalledTimes(1);
    expect(result.name).toEqual(bookInput.name);
    expect(result.author).toEqual(bookInput.author);
    expect(result.price).toEqual(bookInput.price);
});

test('given a call to removeBook with a valid ID, when book exists, then it returns the removed book', async () => {
    // given
    const bookId = 1;
    mockBookDbRemoveBook.mockResolvedValue(book);

    // when
    const result = await bookService.removeBook(bookId);

    // then
    expect(mockBookDbRemoveBook).toHaveBeenCalledTimes(1);
    expect(mockBookDbRemoveBook).toHaveBeenCalledWith(bookId);
    expect(result).toEqual(book);
});

test('given a call to removeBook with an invalid ID, when book does not exist, then an error is thrown', async () => {
    // given
    const invalidBookId = 999;
    mockBookDbRemoveBook.mockResolvedValue(undefined);

    // when
    const removeBookInvalidId = () => bookService.removeBook(invalidBookId);

    // then
    await expect(removeBookInvalidId()).rejects.toThrow("Book with this id does not exist.");
});
