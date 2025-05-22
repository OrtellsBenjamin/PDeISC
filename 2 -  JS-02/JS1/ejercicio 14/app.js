const express = require('express');
const path = require('path');
const app = express();

app.use(express.static('public'));
app.use(express.json());

const letras = ['a', 'b', 'c', 'd', 'e'];
const numeros = [10, 20, 30, 40, 50];
const texto = "Hola Mundo";

app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'views', 'index.html'));
});

app.get('/datos', (req, res) => {
  res.json({ letras, numeros, texto });
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Servidor en http://localhost:${PORT}`);
});
