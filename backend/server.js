import express from 'express';
import path from 'path';
import dotenv from 'dotenv';
import cookieParser from 'cookie-parser';
// import cors from 'cors';
import connectDB from './config/db.js';
import productRoutes from './routes/productRoutes.js';
import userRoutes from './routes/userRoutes.js';
import orderRoutes from './routes/orderRoutes.js';
import uploadRoutes from './routes/uploadRoute.js';
import { notFound, errorHandler } from './middleware/errorMiddleware.js';

// let corsOptions = {
//   origin: 'http://localhost:5173',
//   optionsSuccessStatus: 200,
//   credentials: true,
// };

dotenv.config();
const port = process.env.PORT || 5000;

connectDB().then(() => {
  app.listen(port, () => {
    console.log('helo!');
  });
});

const app = express();

// body parser middleware

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// cookie parser middleware (to access req.cookies)
app.use(cookieParser());

// app.use(cors(corsOptions));

app.get('/', (req, res) => {
  return res.json({ msg: 'hola!' });
});

app.use('/api/products', productRoutes);
app.use('/api/users', userRoutes);
app.use('/api/orders', orderRoutes);
app.use('/api/upload', uploadRoutes);

app.get('/api/config/paypal', (req, res) =>
  //dont put paypalclientID infrontend. only paypal can hit this route to get the paypal client id
  res.send({ clientId: process.env.PAYPAL_CLIENT_ID })
);
const __dirname = path.resolve(); //set dirname to current directory
console.log(__dirname);
app.use('/uploads', express.static(path.join(__dirname, '/uploads')));

app.use(notFound);
app.use(errorHandler);
