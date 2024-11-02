import { Book } from '../model/book';

const books = [
    new Book({
        id: 1,
        name: 'Book 1',
        quantity: 5,
        author: 'John',
        genres: ['Fantasy', 'Adventure'],
        price: 15,
        imageUrl: "/Book1.png",
    }),
    new Book({
        id: 2,
        name: 'Book 2',
        quantity: 8,
        author: 'Jeff',
        genres: ['Action', 'Fiction'],
        price: 10,
        imageUrl: "/Book2.png",
    })
];

const getAllBooks = (): Book[] => {
    return books;
};

const findBookById = (id: number): Book | undefined=> {
    return books.find((book) => book.getId() === id);
};

export default { getAllBooks, findBookById };
