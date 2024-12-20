import { Cart } from "../model/cart";
import { Order } from "../model/order";
import database from "./database";

const getAllOrders = async (): Promise<Order[]> => {
    try {
        const ordersPrisma = await database.order.findMany({
            include: {
                items: true,
            },
        });
        const orders = await Promise.all(ordersPrisma.map((orderPrisma) => Order.from(orderPrisma)));
        return orders;
    } catch (error) {
        console.error(error);
        throw new Error('Database error. See server log for details.')
    }
}

const getAllOrdersByUserId = async (userId: number): Promise<Order[]> => {
    try {
        const ordersPrisma = await database.order.findMany({
            where: {
                userId: userId, 
            },
            include: {
                items: true, 
            },
        });
        const orders = await Promise.all(ordersPrisma.map((orderPrisma) => Order.from(orderPrisma)));
        return orders;
    } catch (error) {
        console.error(error);
        throw new Error('Database error. See server log for details.')
    }
}

const createOrder = async (cart: Cart): Promise<Order> => {
    try {
        const orderItems = cart.getItems().map(item => ({
            bookId: item.book.getId(),
            quantityInCart: item.quantityInCart,
          }));
        const orderPrisma = await database.order.create({
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
        return Order.from(orderPrisma);
    }catch (error) {
        console.error(error);
        throw new Error('Database error. See server log for details.')
    }

    
}


export default { getAllOrders, getAllOrdersByUserId, createOrder, }