import * as dotenv from 'dotenv';
import express, { Request, Response, NextFunction } from 'express';
import cors from 'cors';
import * as bodyParser from 'body-parser';
import swaggerJSDoc from 'swagger-jsdoc';
import swaggerUi from 'swagger-ui-express';
import { expressjwt } from 'express-jwt';
import userRoutes from './controller/user.routes';
import bookRoutes from './controller/book.routes';
import cartRoutes from './controller/cart.routes';
import orderRoutes from './controller/order.routes'
import helmet from 'helmet';

const app = express();
dotenv.config();
const port = process.env.APP_PORT || 3000;

app.use(cors({ origin: 'http://localhost:8080'}));
app.use(bodyParser.json());

app.use(
    expressjwt({
        secret: process.env.JWT_SECRET || 'default_secret',
        algorithms: ['HS256'],
    }).unless({
        path: ['/api-docs', /^\/api-docs\/.*/, '/users/login', '/users/signup', '/books', /^\/books\/\d+$/, '/status'],
    })
);
app.use('/users', userRoutes);
app.use('/books', bookRoutes);
app.use('/carts', cartRoutes);
app.use('/orders', orderRoutes);

app.get('/status', (req, res) => {
    res.json({ message: 'Back-end is running...' });
});

const swaggerOpts = {
    definition: {
        openapi: '3.0.0',
        info: {
            title: 'Courses API',
            version: '1.0.0',
        },
        components: {
            securitySchemes: {
              bearerAuth: {
                type: 'http',
                scheme: 'bearer',
                bearerFormat: 'JWT',
              },
            },
          },
          security: [{ bearerAuth: [] }],
          servers: [{ url: 'http://localhost:3000' }],
        },
    apis: ['./controller/*.routes.ts'],
};
const swaggerSpec = swaggerJSDoc(swaggerOpts);
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));

app.use((err: Error, req: Request, res: Response, next: NextFunction) => {
    if(err.name === 'UnauthorizedError') {
        res.status(401).json({ status: 'application error', message: err.message});
    } else {
        res.status(400).json({ status: 'application error', message: err.message});
    }
})
app.listen(port || 3000, () => {
    console.log(`Back-end is running on port ${port}.`);
});
