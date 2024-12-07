import { CartItem } from '../types';
import { Book } from './book';
import { User } from './user';
import {
    Book as BookPrisma,
    Cart as CartPrisma,
    User as UserPrisma,
    CartItem as CartItemPrisma
} from '@prisma/client'

export class Cart {
    public id?: number;
    readonly user?: User; 
    readonly items: CartItem[]; 
    private totalPrice: number;

    constructor(cart: {
        id?: number;
        user?: User;
    }) {
        this.validate(cart);

        this.id = cart.id;
        this.user = cart.user;
        this.items = [];
        this.totalPrice = 0;
    }

    addBook(book: Book) {
        const existingItem = this.items.find(item => item.book.getId() === book.getId());
        if (existingItem) {
            existingItem.quantityInCart += 1;
        } else {
            this.items.push({ book, quantityInCart: 1 });
        }
        this.calculateTotalPrice();
    }

    removeBook(bookId: number) {
        const existingItem = this.items.find(item => item.book.getId() === bookId);
        
        if (!existingItem) {
            throw new Error(`Book with ID ${bookId} not found in cart.`);
        }

        if (existingItem.quantityInCart > 1) {
            existingItem.quantityInCart -= 1;
        } else {
            this.removeCartItem(bookId); 
        }
        
        this.calculateTotalPrice();
    }

    public removeCartItem(bookId: number) {
        const index = this.items.findIndex(item => item.book.getId() === bookId);
        
        if (index !== -1) {
            this.items.splice(index, 1);
        } else {
            throw new Error(`Book with ID ${bookId} not found in cart.`);
        }
        this.calculateTotalPrice();
    }

    getItems(): CartItem[] {
        return this.items;
    }

    getTotalPrice(): number {
        return this.totalPrice;
    }

    getUser(): User | undefined {
        return this.user;
    }

    getId(): number | undefined {
        return this.id;
    }

    private calculateTotalPrice() {
        let total = 0
        for (const item of this.items) {
            total += item.book.getPrice() * item.quantityInCart
        }

        this.totalPrice = total;
    }

    validate(cart: {
        user?: User;
    }) {
       
    }

    static from({ id }: CartPrisma) {
        return new Cart({
            id,
            // user: User.from(user),
            // items: items.map((item) => CartItem.from(item)),
            // totalPrice
        })
    }
}
