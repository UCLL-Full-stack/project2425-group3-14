import { Role } from "../types";

import { Cart } from "./cart";
import { Order } from "./order";
import {
    Book as BookPrisma,
    Cart as CartPrisma,
    Order as OrderPrisma,
    User as UserPrisma,
    CartItem as CartItemPrisma,
    PrismaClient
} from '@prisma/client'

const prisma = new PrismaClient();
export class User {
    public id?: number;
    readonly username: string;
    readonly email: string;
    readonly password: string;
    readonly role: Role;
    readonly cartId?: number;
    readonly orders: Order[];

    constructor(user: {
        id?: number;
        username: string;
        email: string;
        password: string;
        role: Role;
        cartId?: number;
        orders?: Order[];
    }) {
        this.validate(user);

        this.id = user.id;
        this.username = user.username;
        this.email = user.email;
        this.password = user.password;
        this.role = user.role;
        this.cartId = user.cartId || undefined;
        this.orders = [];
        if (user.orders) {
            this.orders = user.orders;
        }
    }

    getId(): number | undefined {
        return this.id;
    }

    getUsername(): string {
        return this.username;
    }

    getEmail(): string {
        return this.email;
    }

    getPassword(): string {
        return this.password;
    }

    getRole(): Role {
        return this.role;
    }

    getCartId(): number | undefined{
        return this.cartId;
    }

    getOrders(): Order[]{
        return this.orders
    }

    validate(user: {
        username: string;
        email: string;
        password: string;
        role: Role;
    }) {
        if (!user.username?.trim()) {
            throw new Error('Username is required');
        }
        if (!user.email?.trim()) {
            throw new Error('Email is required');
        }
        if (!user.password?.trim()) {
            throw new Error('Password is required');
        }
        if (!user.role) {
            throw new Error('Role is required');
        }
    }

    static async from({ id, username, email, password, role, cartId, orders}: UserPrisma & { cartId?: number, orders?: OrderPrisma[]  }) {
        const resolvedOrders = orders ? await Promise.all(
            orders.map(async (order) => {
                const items = await prisma.orderItem.findMany({
                    where: { orderId: order.id },
                });
    
                return await Order.from({
                    ...order,
                    items, 
                });
            })
        ) : [];
    
        return new User({
            id,
            username,
            email,
            password,
            role: role as Role,
            cartId: cartId,
            orders: resolvedOrders,
        })
    }
}