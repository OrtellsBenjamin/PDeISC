const express = require('express');
const path = require('path');
const app = express();

app.use(express.static('public'));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

let numeros = [10, 20, 30, 40];
let mensajes = ['Hola', '¿Cómo estás?', 'Bienvenido'];
let colaAtencion = ['Cliente1', 'Cliente2', 'Cliente3'];

app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'views', 'index.html'));
});

app.get('/estado', (req, res) => {
  res.json({ numeros, mensajes, colaAtencion });
});

app.post('/shift-numero', (req, res) => {
  const eliminado = numeros.shift() ?? null;
  res.json({ numeros, eliminado });
});

app.post('/shift-mensaje', (req, res) => {
  const eliminado = mensajes.shift() ?? null;
  res.json({ mensajes, eliminado });
});

app.post('/shift-cola', (req, res) => {
  const atendido = colaAtencion.shift() ?? null;
  res.json({ colaAtencion, atendido });
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Servidor corriendo en http://localhost:${PORT}`);
});
