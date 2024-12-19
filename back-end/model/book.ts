import {
    Book as BookPrisma,
    Cart as CartPrisma,
    User as UserPrisma,
    CartItem as CartItemPrisma
} from '@prisma/client'
export class Book {
    public id?: number;
    public name: string;
    public quantity: number;
    public author: string;
    public genres: string[]; 
    public price: number;
    public imageUrl: string;

    constructor(book: {
        id?: number;
        name: string;
        quantity: number;
        author: string;
        genres: string[]; 
        price: number;
        imageUrl: string;
    }) {
        this.validate(book);

        this.id = book.id;
        this.name = book.name;
        this.quantity = book.quantity;
        this.author = book.author;
        this.genres = book.genres;
        this.price = book.price;
        this.imageUrl = book.imageUrl;
    }

    getId(): number | undefined {
        return this.id;
    }

    getName(): string {
        return this.name;
    }

    getQuantity(): number {
        return this.quantity;
    }

    getAuthor(): string {
        return this.author;
    }

    getGenres(): string[] { 
        return this.genres;
    }

    getPrice(): number {
        return this.price;
    }

    getImageUrl(): string {
        return this.imageUrl;
    }

    validate(book: {
        name: string;
        quantity: number;
        author: string;
        genres: string[]; 
        price: number;
        imageUrl: string;
    }) {
        if (!book.name?.trim()) {
            throw new Error('Name is required');
        }
        if (book.quantity < 0) {
            throw new Error('Quantity must be a non-negative number');
        }
        if (!book.author?.trim()) {
            throw new Error('Author is required');
        }
        if (!book.genres || book.genres.length === 0) {
            throw new Error('At least one genre is required');
        }
        if (book.price < 0) {
            throw new Error('Price must be a non-negative number');
        }
        if (!book.imageUrl?.trim()) {
            throw new Error('Image Url is required')
        }
    }

    static from ({ id, name, quantity, author, genres, price, imageUrl}: BookPrisma) {
        return new Book({
            id,
            name,
            quantity,
            author,
            genres,
            price,
            imageUrl
        })
    }
}
