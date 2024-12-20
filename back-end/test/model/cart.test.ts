import { Cart } from '../../model/cart';
import { Book } from '../../model/book';

const book1 = new Book({
    name: "Book 1",
    quantity: 10,
    author: "Author 1",
    genres: ["Fiction"],
    price: 20,
    imageUrl: "/book1.png"
});

const book2 = new Book({
    name: "Book 2",
    quantity: 5,
    author: "Author 2",
    genres: ["Non-Fiction"],
    price: 30,
    imageUrl: "/book2.png"
});

test('given: a cart is created, when: no items are added, then: cart is empty and total price is zero', () => {
    // Given
    const cart = new Cart({});

    // When/Then
    expect(cart.getItems()).toEqual([]);
    expect(cart.getTotalPrice()).toEqual(0);
});

test('given: a book is added to the cart, when: the cart is checked, then: cart contains the book with quantity 1', () => {
    // Given
    const cart = new Cart({});

    // When
    cart.addBook(book1);

    // Then
    const items = cart.getItems();
    expect(items.length).toEqual(1);
    expect(items[0].book.getName()).toEqual(book1.getName());
    expect(items[0].quantityInCart).toEqual(1);
    expect(cart.getTotalPrice()).toEqual(book1.getPrice());
});

test('given: a book is added twice to the cart, when: the cart is checked, then: cart contains the book with quantity 2', () => {
    // Given
    const cart = new Cart({});

    // When
    cart.addBook(book1);
    cart.addBook(book1);

    // Then
    const items = cart.getItems();
    expect(items.length).toEqual(1);
    expect(items[0].book.getName()).toEqual(book1.getName());
    expect(items[0].quantityInCart).toEqual(2);
    expect(cart.getTotalPrice()).toEqual(book1.getPrice() * 2);
});

test('given: a book is removed from the cart, when: the cart is checked, then: the cart no longer contains the book', () => {
    // Given
    const cart = new Cart({});
    cart.addBook(book1);

    // When
    cart.removeBook(book1.getId()!);

    // Then
    const items = cart.getItems();
    expect(items.length).toEqual(0);
    expect(cart.getTotalPrice()).toEqual(0);
});

test('given: a book is added twice and removed once, when: the cart is checked, then: the book quantity decreases to 1', () => {
    // Given
    const cart = new Cart({});
    cart.addBook(book1);
    cart.addBook(book1);

    // When
    cart.removeBook(book1.getId()!);

    // Then
    const items = cart.getItems();
    expect(items.length).toEqual(1);
    expect(items[0].book.getName()).toEqual(book1.getName());
    expect(items[0].quantityInCart).toEqual(1);
    expect(cart.getTotalPrice()).toEqual(book1.getPrice());
});

test('given: an invalid book ID is removed, when: the cart is checked, then: an error is thrown', () => {
    // Given
    const cart = new Cart({});
    cart.addBook(book1);

    // When/Then
    expect(() => cart.removeBook(999)).toThrow(`Book with ID 999 not found in cart.`);
});

test('given: a book is removed completely, when: the cart is checked, then: the book is not in the cart', () => {
    // Given
    const cart = new Cart({});
    cart.addBook(book1);

    // When
    cart.removeCartItem(book1.getId()!);

    // Then
    const items = cart.getItems();
    expect(items.length).toEqual(0);
    expect(cart.getTotalPrice()).toEqual(0);
});