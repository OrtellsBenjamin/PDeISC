const express = require('express');
const path = require('path');
const app = express();

app.use(express.static('public'));
app.use(express.json());

const numeros = [2, 4, 6, 8];
const precios = [
  { precio: 1200 },
  { precio: 350 },
  { precio: 800 }
];

app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'views', 'index.html'));
});

app.get('/datos', (req, res) => {
  res.json({ numeros, precios });
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Servidor escuchando en http://localhost:${PORT}`);
});
