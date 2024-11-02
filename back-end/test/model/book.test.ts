import { Book } from "../../model/book";

const bookName = "Book 1";
const bookQuantity = 5;
const bookAuthor = "Jeff";
const genres = ["Horror"];
const price = 10;
const imageUrl = "/Book2.png";


test('given: valid values for book, when: book is created, then: book is created with those values', () => {
    //given

    //when
    const book1 = new Book({name: bookName, quantity: bookQuantity, author: bookAuthor, genres: genres, price: price, imageUrl: imageUrl})

    //then
    expect(book1.getName()).toEqual(bookName);
    expect(book1.getQuantity()).toEqual(bookQuantity);
    expect(book1.getAuthor()).toEqual(bookAuthor);
    expect(book1.getGenres()).toEqual(genres);
    expect(book1.getPrice()).toEqual(price);
    expect(book1.getImageUrl()).toEqual(imageUrl);
});

test('given: invalid name for book, when: book is created, then: an error is thrown', () => {
    //given
    const invalidName = ""
    //when
    const book1 = () => 
        new Book({name: invalidName, quantity: bookQuantity, author: bookAuthor, genres: genres, price: price, imageUrl: imageUrl});
    //then
    expect(book1).toThrow("Name is required");
});

test('given: negative quantity for book, when: book is created, then: an error is thrown', () => {
    const invalidQuantity = -1;

    const book1 = () => new Book({name: bookName, quantity: invalidQuantity, author: bookAuthor, genres: genres, price: price, imageUrl: imageUrl});

    expect(book1).toThrow("Quantity must be a non-negative number");
});

test('given: invalid author for book, when: book is created, then: an error is thrown', () => {
    const invalidAuthor = "";

    const book1 = () => new Book({name: bookName, quantity: bookQuantity, author: invalidAuthor, genres: genres, price: price, imageUrl: imageUrl});

    expect(book1).toThrow("Author is required");
});


test('given: no genres for book, when: book is created, then: an error is thrown', () => {
    const emptyGenres: string[] = [];
    const book1 = () => new Book({name: bookName, quantity: bookQuantity, author: bookAuthor, genres: emptyGenres, price: price, imageUrl: imageUrl});

    expect(book1).toThrow("At least one genre is required");
});

test('given: negative price for book, when: book is created, then: an error is thrown', () => {
    const invalidPrice = -10;
    const book1 = () => new Book({name: bookName, quantity: bookQuantity, author: bookAuthor, genres: genres, price: invalidPrice, imageUrl: imageUrl});

    expect(book1).toThrow("Price must be a non-negative number");
});

test('given: invalid imageUrl for book, when: book is created, then: an error is thrown', () => {
    const invalidImageUrl = "";
    const book1 = () => new Book({name: bookName, quantity: bookQuantity, author: bookAuthor, genres: genres, price: price, imageUrl: invalidImageUrl});

    expect(book1).toThrow("Image Url is required");
});