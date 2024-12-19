import Head from "next/head";
import Header from "../../components/header";
import styles from "../../styles/Orders.module.css";
import React, { useEffect, useState } from "react";
import { Order } from "@/types";
import OrderService from "@/services/OrderService";
import OrderList from "@/components/orderList";

const Orders: React.FC = () => {
    const [orders, setOrders] = useState<Order[]>([]);
    const [loggedInUser, setLoggedInUser] = useState<any>(null);


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

    const getUsernameById = (userId: number): string => {
        const loggedInUser = JSON.parse(sessionStorage.getItem("loggedInUser")!);
        if (loggedInUser) {
            return loggedInUser.userId === userId ? loggedInUser.username : `User #${userId}`;
        }
        return `User #${userId}`;
    };

    useEffect(() => {
        fetchOrders();
    }, []);

    return (
        <>
            <Head>
                <title>Orders - BookMarkt</title>
                <meta name="description" content="List of all user orders" />
                <meta name="viewport" content="width=device-width, initial-scale=1" />
                <link rel="icon" href="/favicon.ico" />
            </Head>
            <Header />
            <div className={styles.container}>
                {!loggedInUser ? (
                        <p className={styles.errorMessage}>You need to log in to view the orders.</p>
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
