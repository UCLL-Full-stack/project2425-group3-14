import cartService from '../../service/cart.service';
import cartDb from '../../repository/cart.db';
import orderDb from '../../repository/order.db';  // Make sure to import orderDb correctly
import bookDb from '../../repository/book.db';
import { Cart } from '../../model/cart';
import { Book } from '../../model/book';

let mockCartDbFindCartById: jest.Mock;
let mockCartDbAddBookToCart: jest.Mock;
let mockCartDbRemoveBookFromCart: jest.Mock;
let mockCartDbDecreaseBookQuantityInCart: jest.Mock;
let mockOrderDbCreateOrder: jest.Mock; // Mock for orderDb.createOrder
let mockBookDbFindBookById: jest.Mock;

const bookData = {
    id: 1,
    name: 'Test Book',
    quantity: 10,
    author: 'Author Name',
    genres: ['Fiction'],
    price: 20,
    imageUrl: '/test-book.png',
};

const book = new Book(bookData);

const cartData = {
    userId: 1,
    items: [
        { book, quantityInCart: 2 },
    ],
    totalPrice: 40,
};

const cart = new Cart(cartData);

beforeEach(() => {
    mockCartDbFindCartById = jest.fn();
    mockCartDbAddBookToCart = jest.fn();
    mockCartDbRemoveBookFromCart = jest.fn();
    mockCartDbDecreaseBookQuantityInCart = jest.fn();
    mockOrderDbCreateOrder = jest.fn(); // Mock for orderDb.createOrder
    mockBookDbFindBookById = jest.fn();

    // Mock the methods from the repositories
    cartDb.findCartById = mockCartDbFindCartById;
    cartDb.addBookToCart = mockCartDbAddBookToCart;
    cartDb.removeBookFromCart = mockCartDbRemoveBookFromCart;
    cartDb.decreaseBookQuantityInCart = mockCartDbDecreaseBookQuantityInCart;
    bookDb.findBookById = mockBookDbFindBookById;
    orderDb.createOrder = mockOrderDbCreateOrder; // Correctly mock orderDb.createOrder
});

afterEach(() => {
    jest.clearAllMocks();
});

test('given a valid cartId, when ordering the cart, it creates an order and clears the cart', async () => {
    // given
    const cartId = 1;
    mockCartDbFindCartById.mockResolvedValue(cart);
    mockOrderDbCreateOrder.mockResolvedValue(cart);

    // when
    const result = await cartService.orderCart(cartId);

    // then
    expect(mockCartDbFindCartById).toHaveBeenCalledWith(cartId);
    expect(mockOrderDbCreateOrder).toHaveBeenCalledWith(cart); // Check for orderDb.createOrder
    expect(result).toEqual(cart);
});
test('given a valid cartId and bookId, when adding a book to the cart, it adds the book', async () => {
    // given
    const cartId = 1;
    const bookId = 1;
    const updatedCart = { ...cart, items: [...cart.items, { book, quantityInCart: 1 }] };
    mockCartDbFindCartById.mockResolvedValue(cart);
    mockBookDbFindBookById.mockResolvedValue(book);
    mockCartDbAddBookToCart.mockResolvedValue(updatedCart);

    // when
    const result = await cartService.addBookToCart(cartId, bookId);

    // then
    expect(mockCartDbFindCartById).toHaveBeenCalledWith(cartId);
    expect(mockBookDbFindBookById).toHaveBeenCalledWith(bookId);
    expect(mockCartDbAddBookToCart).toHaveBeenCalledWith(cart, book);
    expect(result).toEqual(updatedCart);
});


test('given a valid cartId and bookId, when removing a book from the cart, it removes the book', async () => {
    // given
    const cartId = 1;
    const bookId = 1;
    const updatedCart = { ...cart, items: [] };  // After removal, cart should be empty
    mockCartDbFindCartById.mockResolvedValue(cart);
    mockCartDbRemoveBookFromCart.mockResolvedValue(updatedCart);

    // when
    const result = await cartService.removeBookFromCart(cartId, bookId);

    // then
    expect(mockCartDbFindCartById).toHaveBeenCalledWith(cartId);
    expect(mockCartDbRemoveBookFromCart).toHaveBeenCalledWith(cart, bookId);
    expect(result).toEqual(updatedCart);
});
