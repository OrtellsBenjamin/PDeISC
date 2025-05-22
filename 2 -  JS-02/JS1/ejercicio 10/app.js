const express = require('express');
const path = require('path');
const app = express();

app.use(express.static('public'));
app.use(express.json());

const numeros = [1, 4, 7, 10];
const nombres = ['Ana', 'Luis', 'María', 'Carlos'];
const precios = [100, 250, 80, 400];

app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'views', 'index.html'));
});

app.get('/datos', (req, res) => {
  res.json({ numeros, nombres, precios });
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Servidor escuchando en http://localhost:${PORT}`);
});
