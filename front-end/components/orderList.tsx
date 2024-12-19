import React from 'react';
import { Order } from '@/types';
import { OrderItem } from '@/types';
import styles from '../styles/OrderList.module.css';

interface OrderListProps {
    orders: Order[];
    getUsernameById: (userId: number) => string;
}

const OrderList: React.FC<OrderListProps> = ({ orders, getUsernameById }) => {

    if (!Array.isArray(orders)) {
        return <p className={styles.errorMessage}>No orders available to display.</p>;
    }

    return (
        <section className={styles.orderSection}>
            <div className={styles.orderList}>
                {orders.map((order: Order) => (
                    <div key={order.id} className={styles.orderItem}>
                        <div className={styles.orderHeader}>
                            <h3 className={styles.orderId}>
                                Order #{order.id}
                            </h3>
                            <p className={styles.username}>User: {getUsernameById(order.userId)}</p>
                            <p className={styles.totalPrice}>Total: ${order.totalPrice.toFixed(2)}</p>
                        </div>

                        <div className={styles.orderItems}>
                            <h4>Books in Order:</h4>
                            <ul className={styles.bookList}>
                                {order.items.map((item: OrderItem) => (
                                    <li key={item.book.id} className={styles.bookItem}>
                                        {item.book.name} (x{item.quantityInCart})
                                    </li>
                                ))}
                            </ul>
                        </div>
                    </div>
                ))}
            </div>
        </section>
    );
};

export default OrderList;