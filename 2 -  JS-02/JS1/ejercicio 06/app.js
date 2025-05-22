const express = require('express');
const path = require('path');
const app = express();

app.use(express.static('public'));
app.use(express.json());

const numeros = [5, 10, 15, 20, 25, 30];
const peliculas = ['Matrix', 'Inception', 'Avatar', 'Titanic', 'Interstellar'];
const frutas = ['Manzana', 'Banana', 'Naranja', 'Uva', 'Pera', 'Sandía'];

app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'views', 'index.html'));
});

app.get('/estado', (req, res) => {
  res.json({ numeros, peliculas, frutas });
});

app.post('/slice-primeros', (req, res) => {
  const resultado = numeros.slice(0, 3);
  res.json({ resultado });
});

app.post('/slice-peliculas', (req, res) => {
  const resultado = peliculas.slice(2, 5);
  res.json({ resultado });
});

app.post('/slice-ultimos', (req, res) => {
  const resultado = frutas.slice(-3);
  res.json({ resultado });
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Servidor activo en http://localhost:${PORT}`);
});
