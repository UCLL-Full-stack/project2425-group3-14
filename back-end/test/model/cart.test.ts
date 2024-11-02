import { Cart } from "../../model/cart";
import { Book } from "../../model/book";
import { User } from "../../model/user";
import { CartItem } from "../../types";


const id = 1;
const name ="book1";
const quantity = 10;
const author = "Jeff";
const genres = ["Fictuin"];
const price = 20;
const imageUrl = "/test.png";
const email = "test@test";
const password = "test123456";
const role = 'customer';

let book: Book;
let user: User;
let cart: Cart;


beforeEach(() => {
    book = new Book({name: name, quantity: quantity, author: author, genres: genres, price: price, imageUrl: imageUrl});
    user = new User({id: 1, username: author, email: email, password: password, role: role});
    cart = new Cart({ user });
});

test('given: valid values for cart, when: cart is created, then: cart is created with those values', () => {
    const cart2 = new Cart({id: id, user: user})

    expect(cart2.getItems()).toEqual([])
    expect(cart2.getId()).toEqual(id)
    expect(cart2.getTotalPrice()).toEqual(0)
    expect(cart2.getUser()).toEqual(user)

});

test('given: a book, when: addBook is called, then: the book is added to the cart', () => {
    cart.addBook(book);
    const items = cart.getItems();
    
    expect(items.length).toBe(1);
    expect(items[0].book.getName()).toBe(name);
    expect(items[0].quantityInCart).toBe(1);
});

test('given: a book with quantity 1 in cart, when: removeBook is called, then: the book is removed from cart', () => {
    cart.addBook(book);
    cart.removeBook(book.getId()!);

    const items = cart.getItems();
    expect(items.length).toBe(0);
});

test('given: book not in cart, when: removeBook is called, then: an error is thrown', () => {
    expect(() => cart.removeBook(book.getId()!)).toThrow(`Book with ID ${book.getId()} not found in cart.`);
});

test('given: cart with books, when: removeCartItem is called, then: the book is removed', () => {
    cart.addBook(book);
    cart.removeCartItem(book.getId()!);

    const items = cart.getItems();
    expect(items.length).toBe(0);
});

test('given: book not in cart, when: removeCartItem is called, then: an error is thrown', () => {
    expect(() => cart.removeCartItem(book.getId()!)).toThrow(`Book with ID ${book.getId()} not found in cart.`);
});

test('given: cart with multiple books, when: calculateTotalPrice is called, then: totalPrice is calculated correctly', () => {
    const book2 = new Book({id: 2, name: "Book 2", quantity: 4, author: "John", genres: ['Action'], price: 15, imageUrl: imageUrl });
    cart.addBook(book);
    cart.addBook(book2);

    expect(cart.getTotalPrice()).toEqual(book.getPrice() + book2.getPrice());
});
