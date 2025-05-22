const express = require('express');
const path = require('path');
const app = express();

app.use(express.static('public'));
app.use(express.json());

let roles = ['user', 'editor', 'admin'];
let colores = ['rojo', 'azul', 'amarillo'];
let numeros = [5, 10, 15, 20];

app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'views', 'index.html'));
});

app.get('/estado', (req, res) => {
  res.json({ roles, colores, numeros });
});

app.post('/verificar-admin', (req, res) => {
  const existe = roles.includes('admin');
  res.json({ existe });
});

app.post('/verificar-verde', (req, res) => {
  const existe = colores.includes('verde');
  res.json({ existe });
});

app.post('/agregar-numero', (req, res) => {
  const { numero } = req.body;
  const num = parseInt(numero);
  if (!numeros.includes(num)) {
    numeros.push(num);
    res.json({ agregado: true, numeros });
  } else {
    res.json({ agregado: false, numeros });
  }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Servidor activo en http://localhost:${PORT}`);
});
