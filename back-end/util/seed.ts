import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcrypt';

const prisma = new PrismaClient();

const main = async () => {
    // Clean up existing data
    await prisma.orderItem.deleteMany(); 
    await prisma.order.deleteMany(); 
    await prisma.cartItem.deleteMany();
    await prisma.cart.deleteMany();
    await prisma.book.deleteMany();
    await prisma.user.deleteMany();

    // Seed Books
    const book1 = await prisma.book.create({
        data: {
            id: 1,
            name: 'Book 1',
            quantity: 5,
            author: 'John',
            genres: ['Fantasy', 'Adventure'],
            price: 15,
            imageUrl: '/Book1.png',
        },
    });

    const book2 = await prisma.book.create({
        data: {
            id: 2,
            name: 'Book 2',
            quantity: 8,
            author: 'Jeff',
            genres: ['Action', 'Fiction'],
            price: 10,
            imageUrl: '/Book2.png',
        },
    });

    // Seed Users
    const adminUser = await prisma.user.create({
        data: {
            username: 'admin',
            email: 'admin@example.com',
            password: await bcrypt.hash('admin123', 12),
            role: 'admin',
        },
    });

    const customerUser1 = await prisma.user.create({
        data: {
            username: 'maria',
            email: 'maria@example.com',
            password: await bcrypt.hash('maria123', 12),
            role: 'customer', 
        },
    });

    const customerUser2 = await prisma.user.create({
        data: {
            username: 'john',
            email: 'john@example.com',
            password: await bcrypt.hash('john1234', 12),
            role: 'customer',
        }
    });

    const guestUser = await prisma.user.create({
        data: {
            username: 'guest',
            email: 'guest@example.com',
            password: await bcrypt.hash('guest123', 12),
            role: 'guest', 
        },
    });


    const adminCart = await prisma.cart.create({
        data: {
            userId: adminUser.id, 
            totalPrice: 0,
        },
    });

    const guestCart = await prisma.cart.create({
        data: {
            userId: guestUser.id, 
            totalPrice: 0,
        },
    });

    const customerCart1 = await prisma.cart.create({
        data: {
            userId: customerUser1.id, 
            totalPrice: 0,
        },
    });

    const customerCart2 = await prisma.cart.create({
        data: {
            userId: customerUser2.id, 
            totalPrice: 0,
        },
    });

    const order1 = await prisma.order.create({
        data: {
            userId: customerUser1.id,
            totalPrice: 40,
            items: {
                create: [
                    {
                        bookId: book1.id,
                        quantityInCart: 2,
                    },
                    {
                        bookId: book2.id,
                        quantityInCart: 1, 
                    },
                ],
            },
        },
    });

    const order2 = await prisma.order.create({
        data: {
            userId: customerUser2.id,
            totalPrice: 45,
            items: {
                create: [
                    {
                        bookId: book1.id,
                        quantityInCart: 3,
                    },
                ],
            },
        },
    });

    console.log('Database seeded successfully!');
};

(async () => {
    try {
        await main();
        await prisma.$disconnect();
    } catch (error) {
        console.error('Error seeding database:', error);
        await prisma.$disconnect();
        process.exit(1);
    }
})();
