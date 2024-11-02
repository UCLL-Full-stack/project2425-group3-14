import { Role } from "../types";
import { Cart } from "./cart";

export class User {
    public id?: number;
    private username: string;
    private email: string;
    private password: string;
    private role: Role;
    private cart?: Cart;

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
}