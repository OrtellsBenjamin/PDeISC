const express = require('express');
const path = require('path');
const app = express();

app.use(express.static('public'));
app.use(express.json());

const animales = ['gato', 'perro', 'loro', 'pez'];
const numeros = [10, 20, 30, 40, 50];
const ciudades = ['Buenos Aires', 'Lima', 'Santiago', 'Bogotá'];

app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'views', 'index.html'));
});

app.get('/estado', (req, res) => {
  res.json({ animales, numeros, ciudades });
});

app.post('/buscar-palabra', (req, res) => {
  const index = animales.indexOf('perro');
  res.json({ index });
});

app.post('/buscar-numero', (req, res) => {
  const index = numeros.indexOf(50);
  res.json({ index });
});

app.post('/buscar-ciudad', (req, res) => {
  const index = ciudades.indexOf('Madrid');
  res.json({ index });
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Servidor corriendo en http://localhost:${PORT}`);
});
