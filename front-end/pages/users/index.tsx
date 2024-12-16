import Head from "next/head.js";
import Header from "../../components/header";
import styles from "../../styles/Library.module.css";
import React, { useEffect, useState } from "react";
import { useRouter } from "next/router";
import UserService from "@/services/UserService";
import { User } from "@/types";

const Users: React.FC = () => {
    const [users, setUsers] = useState<User[]>([]);
    const router = useRouter();

    const fetchUsers = async () => {
        try {
            const response = await UserService.getAllUsers(); 
            const data = await response.json();
            setUsers(data);
        } catch (error) {
            console.error("Failed to fetch users:", error);
        }
    };



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
        fetchUsers();
    }, []);

    return (
        <>
            <Head>
                <title>Users - BookMarkt</title>
                <meta name="description" content="List of all available users" />
                <meta name="viewport" content="width=device-width, initial-scale=1" />
                <link rel="icon" href="/favicon.ico" />
            </Head>
            <div className={styles.container}>
                <Header />
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