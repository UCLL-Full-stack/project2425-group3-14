import { Cart } from '../../model/cart';
import { Book } from '../../model/book';
import cartDb from '../../repository/cart.db';
import bookDb from '../../repository/book.db';
import cartService from '../../service/cart.service';

const bookData = {
    id: 1,
    name: 'Book1',
    quantity: 10,
    author: 'Jeff',
    genres: ['Horror'],
    price: 20,
    imageUrl: '/Book.png',
};

const book = new Book(bookData);

const cartData = {
    id: 1,
    items: [],
};

const cart = new Cart(cartData);

let mockCartDbFindCartById: jest.Mock;
let mockCartDbCreateCart: jest.Mock;
let mockCartDbAddBookToCart: jest.Mock;
let mockCartDbRemoveBookFromCart: jest.Mock;
let mockCartDbDecreaseBookQuantityInCart: jest.Mock;
let mockBookDbFindBookById: jest.Mock;

beforeEach(() => {
    mockCartDbFindCartById = jest.fn();
    mockCartDbCreateCart = jest.fn();
    mockCartDbAddBookToCart = jest.fn();
    mockCartDbRemoveBookFromCart = jest.fn();
    mockCartDbDecreaseBookQuantityInCart = jest.fn();
    mockBookDbFindBookById = jest.fn();

    cartDb.findCartById = mockCartDbFindCartById;
    cartDb.createCart = mockCartDbCreateCart;
    cartDb.addBookToCart = mockCartDbAddBookToCart;
    cartDb.removeBookFromCart = mockCartDbRemoveBookFromCart;
    cartDb.decreaseBookQuantityInCart = mockCartDbDecreaseBookQuantityInCart;
    bookDb.findBookById = mockBookDbFindBookById;
});

afterEach(() => {
    jest.clearAllMocks();
});

test('given a valid cart ID and book ID, when adding a book to the cart, then the book is added successfully', () => {
    // given
    const cartId = 1;
    const bookId = 1;
    mockCartDbFindCartById.mockReturnValue(cart);
    mockBookDbFindBookById.mockReturnValue(book);
    mockCartDbAddBookToCart.mockReturnValue(cart);

    // when
    const result = cartService.addBookToCart(cartId, bookId);

    // then
    expect(mockCartDbFindCartById).toHaveBeenCalledTimes(1);
    expect(mockCartDbFindCartById).toHaveBeenCalledWith(cartId);
    expect(mockBookDbFindBookById).toHaveBeenCalledTimes(1);
    expect(mockBookDbFindBookById).toHaveBeenCalledWith(bookId);
    expect(mockCartDbAddBookToCart).toHaveBeenCalledTimes(1);
    expect(result).toEqual(cart);
});

test('given an invalid book ID, when adding a book to the cart, then an error is thrown', () => {
    // given
    const cartId = 1;
    const invalidBookId = 999;
    mockCartDbFindCartById.mockReturnValue(cart);
    mockBookDbFindBookById.mockReturnValue(undefined);

    // when
    const addBook = () => cartService.addBookToCart(cartId, invalidBookId);

    // then
    expect(addBook).toThrow("Book with this id does not exist!");
    expect(mockCartDbFindCartById).toHaveBeenCalledTimes(1);
    expect(mockCartDbFindCartById).toHaveBeenCalledWith(cartId);
    expect(mockBookDbFindBookById).toHaveBeenCalledTimes(1);
    expect(mockBookDbFindBookById).toHaveBeenCalledWith(invalidBookId);
});

test('given an invalid cart ID, when adding a book to the cart, then an error is thrown', () => {
    // given
    const invalidCartId = 999;
    const bookId = 1;
    mockCartDbFindCartById.mockReturnValue(undefined);
    mockBookDbFindBookById.mockReturnValue(book);

    // when
    const addBook = () => cartService.addBookToCart(invalidCartId, bookId);

    // then
    expect(addBook).toThrow("Cart with this id does not exist!");
});

test('given a valid cart ID and book ID, when removing a book from the cart, then the book is removed successfully', () => {
    // given
    const cartId = 1;
    const bookId = 1;
    mockCartDbFindCartById.mockReturnValue(cart);
    mockCartDbRemoveBookFromCart.mockReturnValue(cart);

    // when
    const result = cartService.removeBookFromCart(cartId, bookId);

    // then
    expect(mockCartDbFindCartById).toHaveBeenCalledTimes(1);
    expect(mockCartDbFindCartById).toHaveBeenCalledWith(cartId);
    expect(mockCartDbRemoveBookFromCart).toHaveBeenCalledTimes(1);
    expect(mockCartDbRemoveBookFromCart).toHaveBeenCalledWith(cart, bookId);
    expect(result).toEqual(cart);
});

test('given an invalid cart ID, when removing a book from the cart, then an error is thrown', () => {
    // given
    const invalidCartId = 999;
    const bookId = 1;
    mockCartDbFindCartById.mockReturnValue(undefined);

    // when
    const removeBook = () => cartService.removeBookFromCart(invalidCartId, bookId);

    // then
    expect(removeBook).toThrow("Cart with this id does not exist!");
});

test('given a valid cart ID and book ID, when decreasing the quantity of a book in the cart, then the quantity is decreased successfully', () => {
    // given
    const cartId = 1;
    const bookId = 1;
    mockCartDbFindCartById.mockReturnValue(cart);
    mockCartDbDecreaseBookQuantityInCart.mockReturnValue(cart);

    // when
    const result = cartService.decreaseBookQuantityFromCart(cartId, bookId);

    // then
    expect(mockCartDbFindCartById).toHaveBeenCalledTimes(1);
    expect(mockCartDbFindCartById).toHaveBeenCalledWith(cartId);
    expect(mockCartDbDecreaseBookQuantityInCart).toHaveBeenCalledTimes(1);
    expect(mockCartDbDecreaseBookQuantityInCart).toHaveBeenCalledWith(cart, bookId);
    expect(result).toEqual(cart);
});

test('given an invalid cart ID, when decreasing the quantity of a book in the cart, then an error is thrown', () => {
    // given
    const invalidCartId = 999;
    const bookId = 1;
    mockCartDbFindCartById.mockReturnValue(undefined);

    // when
    const decreaseQuantity = () => cartService.decreaseBookQuantityFromCart(invalidCartId, bookId);

    // then
    expect(decreaseQuantity).toThrow("Cart with this id does not exist!");
});
