const express = require('express');
const path = require('path');
const app = express();

app.use(express.static('public'));
app.use(express.json());

const numeros = [4, 11, 8, 25, 3, 18];
const palabras = ['casa', 'maravilla', 'sol', 'computadora', 'voz'];
const usuarios = [
  { nombre: 'Lucía', activo: true },
  { nombre: 'Pedro', activo: false },
  { nombre: 'Sofía', activo: true },
  { nombre: 'Marcos', activo: false }
];

app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'views', 'index.html'));
});

app.get('/datos', (req, res) => {
  res.json({ numeros, palabras, usuarios });
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Servidor en http://localhost:${PORT}`);
});
