const express = require('express');
const path = require('path');
const app = express();

app.use(express.static('public'));
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

let colores = [];
let tareas = ['Lavar', 'Estudiar'];
let usuarios = ['Carlos', 'Lucía'];

app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'views', 'index.html'));
});

app.get('/estado', (req, res) => {
  res.json({ colores, tareas, usuarios });
});

app.post('/unshift-color', (req, res) => {
  const { color } = req.body;
  if (color) colores.unshift(color);
  res.json({ colores });
});

app.post('/unshift-tarea', (req, res) => {
  const { tarea } = req.body;
  if (tarea) tareas.unshift(tarea);
  res.json({ tareas });
});

app.post('/unshift-usuario', (req, res) => {
  const { usuario } = req.body;
  if (usuario) usuarios.unshift(usuario);
  res.json({ usuarios });
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Servidor corriendo en http://localhost:${PORT}`);
});