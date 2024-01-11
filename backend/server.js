import express from 'express';
import products from './data/products.js';
import dotenv from 'dotenv';
import cors from 'cors';

dotenv.config();
const port = process.env.PORT || 5000;

const app = express();

app.use(cors());

app.get('/', (req, res) => {
  return res.json({ msg: 'hola!' });
});

app.get('/api/products', (req, res) => {
  return res.json(products);
});

app.get('/api/products/:id', (req, res) => {
  const { id: productId } = req.params;
  const selectedProduct = products.find((product) => product._id === productId);
  res.json(selectedProduct);
});

app.listen(port, () => {
  console.log('helo!');
});