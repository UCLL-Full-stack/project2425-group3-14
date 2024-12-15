import { CartItem } from '../types'; 
import { Book } from './book';
import { User } from './user';
import { Cart as CartPrisma, CartItem as CartItemPrisma, User as UserPrisma } from '@prisma/client';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export class Cart {
    public id?: number;
    public user?: User;
    public items: CartItem[]; 
    private totalPrice: number;

    constructor(cart: {
        id?: number;
        user?: User;
    }) {
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
        let total = 0;
        for (const item of this.items) {
            total += item.book.getPrice() * item.quantityInCart;
        }

        this.totalPrice = total;
    }

    static async from({ id, user, items }: CartPrisma & { user?: UserPrisma; items?: CartItemPrisma[] }) {
        const cart = new Cart({ id });

        if (user) {
            cart.user = User.from(user);
        }

        if (items) {
            cart.items = await Promise.all(
                items.map(async (item) => {
                    const book = await prisma.book.findUnique({
                        where: { id: item.bookId }, 
                    });
                    if (book) {
                        return {
                            book: Book.from(book), 
                            quantityInCart: item.quantityInCart,
                        };
                    }
                    throw new Error(`Book with ID ${item.bookId} not found`);
                })
            );
        }

        cart.calculateTotalPrice();
        return cart;
    }
}
