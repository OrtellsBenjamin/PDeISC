const express = require('express');
const path = require('path');
const app = express();

app.use(express.static('public'));
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

let animales = ['Perro', 'Gato', 'Loro'];
let compras = ['Pan', 'Leche', 'Arroz'];

app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'views', 'index.html'));
});

app.get('/estado', (req, res) => {
  res.json({ animales, compras });
});

app.post('/pop-animal', (req, res) => {
  const eliminado = animales.pop();
  res.json({ animales, eliminado });
});

app.post('/pop-compra', (req, res) => {
  const eliminado = compras.pop();
  res.json({ compras, eliminado });
});

app.post('/vaciar-animales', (req, res) => {
  while (animales.length > 0) {
    animales.pop();
  }
  res.json({ animales });
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Servidor corriendo en http://localhost:${PORT}`);
});
