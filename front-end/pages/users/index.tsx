import Head from "next/head.js";
import Header from "../../components/header";
import styles from "../../styles/Library.module.css";
import React, { useEffect, useState } from "react";
import { useRouter } from "next/router";
import UserService from "@/services/UserService";
import { User } from "@/types";
import CartService from "@/services/CartService";
import { CartItem } from "@/types";

const Users: React.FC = () => {
    const [users, setUsers] = useState<User[]>([]);
    const [isAuthorized, setIsAuthorized] = useState<boolean>(false);
    const router = useRouter();
    const [cartAmount, setCartAmount] = useState<number>(0);
    const isLoggedIn = typeof window !== 'undefined' && sessionStorage.getItem('loggedInUser');

    const fetchUsers = async () => {
        try {
            const response = await UserService.getAllUsers(); 
            const data = await response.json();
            setUsers(data);
        } catch (error) {
            console.error("Failed to fetch users:", error);
        }
    };

    const getCartAmount = async () => {
            if (typeof window !== "undefined" && isLoggedIn) {
                const cartId = JSON.parse(sessionStorage.getItem("loggedInUser")!).cartId;
                const response = await CartService.allBooksInCart(cartId);
                const cartItems = await response.json();
                console.log("Cart Items:", cartItems);
                if (cartItems.items && Array.isArray(cartItems.items)) {
                    const totalQuantity = cartItems.items.reduce((total: number, cartItem: CartItem) => total + cartItem.quantityInCart, 0);
                
                    setCartAmount(totalQuantity);
                    sessionStorage.setItem('cartAmount', totalQuantity.toString());
                    } else {
                    console.error("cartItems.items is not an array:", cartItems.items);
                    }
            }
        }



    const handleRemoveUser = async (userId: number) => {
        try {
            await UserService.removeUser(userId);
            fetchUsers();
            // setUsers((prevUsers) => prevUsers.filter((user) => user.id !== userId));
        } catch (error) {
            console.error("Failed to remove user:", error);
        }
    };

    useEffect(() => {
        if (typeof window !== "undefined") {
            const loggedInUser = sessionStorage.getItem("loggedInUser");
            if (loggedInUser) {
                const user = JSON.parse(loggedInUser);
                if (user.role === "admin") {
                    setIsAuthorized(true);
                    fetchUsers();
                    getCartAmount();
                    const cartAmount = sessionStorage.getItem('cartAmount');
                    if (cartAmount){
                        setCartAmount(Number(cartAmount));
                    }
                } else {
                    setIsAuthorized(false);
                }
            } else {
                setIsAuthorized(false);
            }
        }
    }, []);

    if (!isAuthorized) {
        return (

            <>
            <Head>
                <title>Users - BookMarkt</title>
                <meta name="description" content="List of all available users" />
                <meta name="viewport" content="width=device-width, initial-scale=1" />
                <link rel="icon" href="/favicon.ico" />
            </Head>
            <div className={styles.container}>
                <Header cartAmount={cartAmount}/>
                <div className={styles.searchContainer}>
                    <h2 className={styles.title}>All Users</h2>
                </div>
                <main>
                    <div className={styles.container}>
                    <p  className={styles.errorMessage}>You are not authorized to view this page.</p>
                    </div>
                </main>
            </div>
        </>
            
        );
    }

    return (
        <>
            <Head>
                <title>Users - BookMarkt</title>
                <meta name="description" content="List of all available users" />
                <meta name="viewport" content="width=device-width, initial-scale=1" />
                <link rel="icon" href="/favicon.ico" />
            </Head>
            <div className={styles.container}>
                <Header cartAmount={cartAmount}/>
                <div className={styles.searchContainer}>
                    <h2 className={styles.title}>All Users</h2>
                </div>
                <main>
                    <section>
                        <table className={styles.table}>
                            <thead>
                                <tr>
                                    <th>Username</th>
                                    <th>Email</th>
                                    <th>Role</th>
                                    <th>Action</th>
                                </tr>
                            </thead>
                            <tbody>
                                {Array.isArray(users) && users.map((user: User) => (
                                    <tr key={user.id}>
                                        <td>{user.username}</td>
                                        <td>{user.email}</td>
                                        <td>{user.role.toLowerCase()}</td>
                                        <td>
                                            <button 
                                                className={styles.removeButton} 
                                                onClick={() => handleRemoveUser(user.id)}
                                            >
                                                Remove
                                            </button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </section>
                </main>
            </div>
        </>
    );
};

export default Users;