import Head from "next/head";
import Header from "../../components/header";
import styles from "../../styles/Orders.module.css";
import React, { useEffect, useState } from "react";
import { Order } from "@/types";
import OrderService from "@/services/OrderService";
import OrderList from "@/components/orderList";
import UserService from "@/services/UserService";
import CartService from "@/services/CartService";
import { CartItem } from "@/types";

const Orders: React.FC = () => {
    const [orders, setOrders] = useState<Order[]|null>([]);
    const [loggedInUser, setLoggedInUser] = useState<any>(null);
    const [cartAmount, setCartAmount] = useState<number>(0);
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const [isLoading, setIsLoading] = useState(true);


    const fetchOrders = async () => {
        if (typeof window === "undefined") {
            console.error("Session storage issue");
            return;
        }
        const loggedInUser = JSON.parse(sessionStorage.getItem("loggedInUser")!);
        if(loggedInUser){
            try {
                setLoggedInUser(loggedInUser);
                const userIdAsString = String(loggedInUser.userId);
                const response = await OrderService.getAllOrders(userIdAsString);

                if (response.status === 401) {
                    console.error("Unauthorized access:", response.statusText);
                    setOrders(null); 
                    return;
                }

                if (!response.ok) {
                    console.error("Failed to fetch order data:", response.statusText);
                    return;
                }
                const data = await response.json();
                console.log("Fetched orders:", data);
                setOrders(data || []);

            } catch (error) {
                console.error("Failed to fetch orders:", error);
            }
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

    const getUsernameById = async (userId: number): Promise<string | null> => {
        try {
            const response = await UserService.getAllUsers();
    
            if (!response.ok) {
                console.error("Failed to fetch users:", response.statusText);
                return null;
            }
            const users = await response.json();
            const user = users.find((user: { id: number }) => user.id === userId);
    
            if (!user) {
                console.error("User not found");
                return null;
            }
    
            return user.username;
        } catch (error) {
            console.error("Error fetching users:", error);
            return null;
        }
    };

    useEffect(() => {
        fetchOrders();
        getCartAmount();
        const cartAmount = sessionStorage.getItem('cartAmount');
        if (cartAmount){
            setCartAmount(Number(cartAmount));
        }
        if (sessionStorage.getItem('loggedInUser')){
            setIsLoggedIn(true);
        }
        setIsLoading(false);
    }, []);

    if (isLoading) {
            return (
                <>
                    <Head>
                        <title>Books - BookMarkt</title>
                        <meta name="description" content="List of all available books" />
                        <meta name="viewport" content="width=device-width, initial-scale=1" />
                        <link rel="icon" href="/favicon.ico" />
                    </Head>
                </>
            )
        }
    return (
        <>
            <Head>
                <title>Orders - BookMarkt</title>
                <meta name="description" content="List of all user orders" />
                <meta name="viewport" content="width=device-width, initial-scale=1" />
                <link rel="icon" href="/favicon.ico" />
            </Head>
            <Header cartAmount={cartAmount}/>
            <div className={styles.container}>
            {!loggedInUser ? (
                <p className={styles.errorMessage}>You need to log in to view the orders.</p>
            ) : orders === null ? ( 
                <p className={styles.errorMessage}>You are not authorized to view this page.</p>
            ) : (
                <>
                    <h2 className={styles.title}>All Orders</h2>
                    <main className={styles.main}>
                        <OrderList orders={orders} getUsernameById={getUsernameById} />
                    </main>
                </>
            )}
            </div>
        </>
    );
};

export default Orders;
