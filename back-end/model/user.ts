import { Role } from "../types";

import { Cart } from "./cart";
import {
    Book as BookPrisma,
    Cart as CartPrisma,
    User as UserPrisma,
    CartItem as CartItemPrisma
} from '@prisma/client'

export class User {
    public id?: number;
    readonly username: string;
    readonly email: string;
    readonly password: string;
    readonly role: Role;
    readonly cart?: Cart;

    constructor(user: {
        id?: number;
        username: string;
        email: string;
        password: string;
        role: Role;
        cart?: Cart;
    }) {
        this.validate(user);

        this.id = user.id;
        this.username = user.username;
        this.email = user.email;
        this.password = user.password;
        this.role = user.role;
        this.cart = user.cart || undefined;
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

    getCart(): Cart | undefined{
        return this.cart;
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

    static from({ id, username, email, password, role, cart}: UserPrisma & { cart?: CartPrisma; }) {
        return new User({
            id,
            username,
            email,
            password,
            role: role as Role,
            // cart: Cart.from(cart?cart:undefined),
        })
    }
}