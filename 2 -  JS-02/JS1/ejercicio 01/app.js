const express = require('express');
const app = express();
const port = 3000;

let frutas = [];
let amigos = ['Luis', 'Ana', 'Carlos'];
let numeros = [3, 7, 12];

app.use(express.static('public'));
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

app.get('/', (req, res) => {
  res.sendFile(__dirname + '/views/index.html');
});

app.post('/push-fruta', (req, res) => {
  const { fruta } = req.body;
  frutas.push(fruta);
  res.json({ frutas });
});

app.post('/push-amigo', (req, res) => {
  const { nombre } = req.body;
  amigos.push(nombre);
  res.json({ amigos });
});

app.post('/push-numero', (req, res) => {
  const { numero } = req.body;
  const num = parseInt(numero);
  if (num > numeros[numeros.length - 1]) {
    numeros.push(num);
  }
  res.json({ numeros });
});

app.listen(port, () => {
});console.log(`Servidor corriendo en http://localhost:${port}`);