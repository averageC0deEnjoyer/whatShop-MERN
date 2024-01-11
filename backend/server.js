import express from 'express';
const port = 5000;
const app = express();

app.get('/', (req, res) => {
  return res.json({ msg: 'hola!' });
});

app.listen(port, () => {
  console.log('helo!');
});
