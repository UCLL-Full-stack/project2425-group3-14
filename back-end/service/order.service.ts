import orderDb from "../repository/order.db";
import { Order } from '../model/order';
import { UnauthorizedError } from "express-jwt";

const getAllOrders = async ({ username, role }, userId): Promise<Order[]> => {
    const id = parseInt(userId, 10);
    if (role === 'admin' || role === 'manager'){
        return await orderDb.getAllOrders();
    }
    else if (id){
        return await orderDb.getAllOrdersByUserId(id);
    }
    else {
        throw new UnauthorizedError('credentials_required', {
            message: 'You have to login to acces this page.'
        });
    }
    
};


export default { getAllOrders, }