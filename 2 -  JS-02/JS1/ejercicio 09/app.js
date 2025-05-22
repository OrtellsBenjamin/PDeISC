const express = require('express');
const path = require('path');
const app = express();

app.use(express.static('public'));
app.use(express.json());

const nombres = ['Lucía', 'Juan', 'Pedro', 'Ana'];
const numeros = [2, 4, 6, 8];
const personas = [
  { nombre: 'Carlos', edad: 28 },
  { nombre: 'Laura', edad: 35 },
  { nombre: 'Miguel', edad: 22 },
];

app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'views', 'index.html'));
});

app.get('/estado', (req, res) => {
  res.json({ nombres, numeros, personas });
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Servidor escuchando en http://localhost:${PORT}`);
});
