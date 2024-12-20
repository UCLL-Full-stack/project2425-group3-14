import cartService from '../../service/cart.service';
import cartDb from '../../repository/cart.db';
import orderDb from '../../repository/order.db';
import bookDb from '../../repository/book.db';
import { Cart } from '../../model/cart';
import { Book } from '../../model/book';

// Mock data
const cartId = 1;
const bookId = 1;

const cart = new Cart({ id: cartId, userId: 1 });
const book = new Book({
    id: bookId,
    name: 'Test Book',
    author: 'Test Author',
    price: 10,
    quantity: 5,
    genres: ['Fiction'],
    imageUrl: '/test.png'
});

let mockCartDbFindCartById: jest.Mock;
let mockBookDbFindBookById: jest.Mock;
let mockCartDbAddBookToCart: jest.Mock;
let mockCartDbRemoveBookFromCart: jest.Mock;
let mockOrderDbCreateOrder: jest.Mock;
let mockCartDbDecreaseBookQuantityInCart: jest.Mock;

beforeEach(() => {
    mockCartDbFindCartById = jest.fn();
    mockBookDbFindBookById = jest.fn();
    mockCartDbAddBookToCart = jest.fn();
    mockCartDbRemoveBookFromCart = jest.fn();
    mockOrderDbCreateOrder = jest.fn();
    mockCartDbDecreaseBookQuantityInCart = jest.fn();

    // Mocking the methods of the repositories
    cartDb.findCartById = mockCartDbFindCartById;
    bookDb.findBookById = mockBookDbFindBookById;
    cartDb.addBookToCart = mockCartDbAddBookToCart;
    cartDb.removeBookFromCart = mockCartDbRemoveBookFromCart;
    orderDb.createOrder = mockOrderDbCreateOrder;
    cartDb.decreaseBookQuantityInCart = mockCartDbDecreaseBookQuantityInCart;
});

afterEach(() => {
    jest.clearAllMocks();
});

test('given a call to getCartById with a valid cart ID, it returns the cart', async () => {
    // given
    mockCartDbFindCartById.mockResolvedValue(cart);

    // when
    const result = await cartService.getCartById(cartId);

    // then
    expect(mockCartDbFindCartById).toHaveBeenCalledTimes(1);
    expect(result).toEqual(cart);
});

test('given a call to getCartById with an invalid cart ID, it throws an error', async () => {
    // given
    const invalidCartId = 999;
    mockCartDbFindCartById.mockResolvedValue(null);

    // when
    const getCart = () => cartService.getCartById(invalidCartId);

    // then
    await expect(getCart()).rejects.toThrow("Cart with this id does not exist!");
});

test('given a call to addBookToCart with valid cart and book IDs, it adds the book to the cart', async () => {
    // given
    mockCartDbFindCartById.mockResolvedValue(cart);
    mockBookDbFindBookById.mockResolvedValue(book);
    mockCartDbAddBookToCart.mockResolvedValue(cart);

    // when
    const result = await cartService.addBookToCart(cartId, bookId);

    // then
    expect(mockCartDbFindCartById).toHaveBeenCalledWith(cartId);
    expect(mockBookDbFindBookById).toHaveBeenCalledWith(bookId);
    expect(mockCartDbAddBookToCart).toHaveBeenCalledWith(cart, book);
    expect(result).toEqual(cart);
});

test('given a call to addBookToCart with an invalid book ID, it throws an error', async () => {
    // given
    const invalidBookId = 999;
    mockCartDbFindCartById.mockResolvedValue(cart);
    mockBookDbFindBookById.mockResolvedValue(null);

    // when
    const addBookToInvalidCart = () => cartService.addBookToCart(cartId, invalidBookId);

    // then
    await expect(addBookToInvalidCart()).rejects.toThrow("Book with this id does not exist!");
});

test('given a call to addBookToCart with an invalid cart ID, it throws an error', async () => {
    // given
    const invalidCartId = 999;
    mockCartDbFindCartById.mockResolvedValue(null);

    // when
    const addBookToInvalidCart = () => cartService.addBookToCart(invalidCartId, bookId);

    // then
    await expect(addBookToInvalidCart()).rejects.toThrow("Book with this id does not exist!");
});

test('given a call to removeBookFromCart with valid cart and book IDs, it removes the book from the cart', async () => {
    // given
    mockCartDbFindCartById.mockResolvedValue(cart);
    mockCartDbRemoveBookFromCart.mockResolvedValue(cart);

    // when
    const result = await cartService.removeBookFromCart(cartId, bookId);

    // then
    expect(mockCartDbFindCartById).toHaveBeenCalledWith(cartId);
    expect(mockCartDbRemoveBookFromCart).toHaveBeenCalledWith(cart, bookId);
    expect(result).toEqual(cart);
});

test('given a call to removeBookFromCart with an invalid cart ID, it throws an error', async () => {
    // given
    const invalidCartId = 999;
    mockCartDbFindCartById.mockResolvedValue(null);

    // when
    const removeBookFromInvalidCart = () => cartService.removeBookFromCart(invalidCartId, bookId);

    // then
    await expect(removeBookFromInvalidCart()).rejects.toThrow("Cart with this id does not exist!");
});

test('given a call to orderCart with a valid cart ID, it orders the cart and removes books from the cart', async () => {
    // given
    mockCartDbFindCartById.mockResolvedValue(cart);
    mockOrderDbCreateOrder.mockResolvedValue({});
    mockCartDbRemoveBookFromCart.mockResolvedValue(cart);

    // when
    const result = await cartService.orderCart(cartId);

    // then
    expect(mockCartDbFindCartById).toHaveBeenCalledWith(cartId);
    expect(mockOrderDbCreateOrder).toHaveBeenCalledWith(cart);
    expect(mockCartDbRemoveBookFromCart).toHaveBeenCalledTimes(cart.getItems().length);  // Ensure all items are removed
    expect(result).toEqual(cart);
});

test('given a call to orderCart with an invalid cart ID, it throws an error', async () => {
    // given
    const invalidCartId = 999;
    mockCartDbFindCartById.mockResolvedValue(null);

    // when
    const orderInvalidCart = () => cartService.orderCart(invalidCartId);

    // then
    await expect(orderInvalidCart()).rejects.toThrow("Cart with this id does not exist!");
});

test('given a call to decreaseBookQuantityFromCart with valid cart and book IDs, it decreases the book quantity in the cart', async () => {
    // given
    mockCartDbFindCartById.mockResolvedValue(cart);
    mockCartDbDecreaseBookQuantityInCart.mockResolvedValue(cart);

    // when
    const result = await cartService.decreaseBookQuantityFromCart(cartId, bookId);

    // then
    expect(mockCartDbFindCartById).toHaveBeenCalledWith(cartId);
    expect(mockCartDbDecreaseBookQuantityInCart).toHaveBeenCalledWith(cart, bookId);
    expect(result).toEqual(cart);
});

test('given a call to decreaseBookQuantityFromCart with an invalid cart ID, it throws an error', async () => {
    // given
    const invalidCartId = 999;
    mockCartDbFindCartById.mockResolvedValue(null);

    // when
    const decreaseBookQuantityInInvalidCart = () => cartService.decreaseBookQuantityFromCart(invalidCartId, bookId);

    // then
    await expect(decreaseBookQuantityInInvalidCart()).rejects.toThrow("Cart with this id does not exist!");
});
