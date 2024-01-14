import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import connectDB from './config/db.js';
import productRoutes from './routes/productRoutes.js';
import { notFound, errorHandler } from './middleware/errorMiddleware.js';

dotenv.config();
const port = process.env.PORT || 5000;

connectDB().then(() => {
  app.listen(port, () => {
    console.log('helo!');
  });
});

const app = express();

// app.use(cors());

app.get('/', (req, res) => {
  return res.json({ msg: 'hola!' });
});

app.use('/api/products', productRoutes);

app.use(notFound);
app.use(errorHandler);
