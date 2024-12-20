import { OrderItem } from '../types'; 
import { User } from './user';
import { Cart } from './cart';
import { PrismaClient } from '@prisma/client';
import { Cart as CartPrisma, CartItem as CartItemPrisma, User as UserPrisma, Order as OrderPrisma, OrderItem as OrderItemPrisma } from '@prisma/client';
import { Book } from './book';

const prisma = new PrismaClient();

export class Order{
    public id?: number;
    public userId: number;
    public items: OrderItem[];
    public totalPrice: number;

    constructor(order: { id?: number; userId: number, items: OrderItem[], totalPrice: number}) {
        this.id = order.id
        this.userId = order.userId;
        this.items = order.items;
        this.totalPrice = order.totalPrice;
      }

    static async createOrder(cart: Cart) {
        const orderItems = cart.getItems().map(item => ({
            bookId: item.book.getId(),
            quantityInCart: item.quantityInCart,
          }));
           
        const order = await prisma.order.create({
            data: {
            userId: cart.getUserId(),
            totalPrice: cart.getTotalPrice(),
            items: {
                create: orderItems,
            },
            },
            include: {
            items: true,
            },
        });
    
      
    }

    static async from({ id, userId, items, totalPrice }: OrderPrisma & { userId: number; items: OrderItemPrisma[]; totalPrice: number }) {
        const orderItems = await Promise.all(
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
        const order = new Order({ id, userId: userId, items: orderItems, totalPrice });  
        return order
    }
        

}