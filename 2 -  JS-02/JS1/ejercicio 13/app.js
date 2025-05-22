const express = require('express');
const path = require('path');
const app = express();

app.use(express.static('public'));
app.use(express.json());

const numeros = [30, 4, 15, 2, 90];
const palabras = ['manzana', 'kiwi', 'banana', 'uva', 'pera'];
const personas = [
  { nombre: 'Lucía', edad: 25 },
  { nombre: 'Carlos', edad: 32 },
  { nombre: 'Sofía', edad: 21 },
  { nombre: 'Andrés', edad: 40 }
];

app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'views', 'index.html'));
});

app.get('/datos', (req, res) => {
  res.json({ numeros, palabras, personas });
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Servidor en http://localhost:${PORT}`);
});
