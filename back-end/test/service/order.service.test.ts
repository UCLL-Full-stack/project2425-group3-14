import orderService from '../../service/order.service';
import orderDb from '../../repository/order.db';
import { UnauthorizedError } from 'express-jwt';
import { Order } from '@prisma/client';

let mockOrderDbGetAllOrders: jest.Mock;
let mockOrderDbGetAllOrdersByUserId: jest.Mock;

const userId = '1';
const adminRole = 'admin';
const customerRole = 'customer';
const invalidRole = 'guest';

beforeEach(() => {
    mockOrderDbGetAllOrders = jest.fn();
    mockOrderDbGetAllOrdersByUserId = jest.fn();

    // Mocking the repository methods
    orderDb.getAllOrders = mockOrderDbGetAllOrders;
    orderDb.getAllOrdersByUserId = mockOrderDbGetAllOrdersByUserId;
});

afterEach(() => {
    jest.clearAllMocks();
});

test('given an admin user, when calling getAllOrders, it fetches all orders', async () => {
    // given
    const orders = [{ id: 1, userId: 1, totalPrice: 100 }];
    mockOrderDbGetAllOrders.mockResolvedValue(orders);

    // when
    const result = await orderService.getAllOrders({ username: 'adminUser', role: adminRole }, userId);

    // then
    expect(mockOrderDbGetAllOrders).toHaveBeenCalledTimes(1);
    expect(result).toEqual(orders);
});

test('given a customer user, when calling getAllOrders, it fetches orders by user ID', async () => {
    // given
    const orders = [{ id: 1, userId: 1, totalPrice: 100 }];
    mockOrderDbGetAllOrdersByUserId.mockResolvedValue(orders);

    // when
    const result = await orderService.getAllOrders({ username: 'customerUser', role: customerRole }, userId);

    // then
    expect(mockOrderDbGetAllOrdersByUserId).toHaveBeenCalledTimes(1);
    expect(mockOrderDbGetAllOrdersByUserId).toHaveBeenCalledWith(parseInt(userId, 10));
    expect(result).toEqual(orders);
});

test('given an invalid userId, when calling getAllOrders, it still works with the valid role', async () => {
    // given
    const orders = [{ id: 1, userId: 1, totalPrice: 100 }];
    mockOrderDbGetAllOrders.mockResolvedValue(orders);

    // when
    const result = await orderService.getAllOrders({ username: 'adminUser', role: adminRole }, 'nonExistentUserId');

    // then
    expect(mockOrderDbGetAllOrders).toHaveBeenCalledTimes(1);
    expect(result).toEqual(orders);
});

test('given a customer user, when calling getAllOrders and no orders exist for the user, it returns an empty array', async () => {
    // given
    const orders: Order[] = [];
    mockOrderDbGetAllOrdersByUserId.mockResolvedValue(orders);

    // when
    const result = await orderService.getAllOrders({ username: 'customerUser', role: customerRole }, userId);

    // then
    expect(mockOrderDbGetAllOrdersByUserId).toHaveBeenCalledTimes(1);
    expect(result).toEqual(orders);
});
