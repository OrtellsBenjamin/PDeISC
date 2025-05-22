const express = require('express');
const path = require('path');
const app = express();

app.use(express.static('public'));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

let letras = ['A', 'B', 'C', 'D', 'E'];
let nombres = ['Juan', 'Ana', 'Luis'];
let items = ['Pan', 'Queso', 'Leche', 'Huevos'];

app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'views', 'index.html'));
});

app.get('/estado', (req, res) => {
  res.json({ letras, nombres, items });
});

app.post('/splice-eliminar', (req, res) => {
  letras.splice(1, 2);
  res.json({ letras });
});

app.post('/splice-insertar', (req, res) => {
  nombres.splice(1, 0, 'Carlos');
  res.json({ nombres });
});

app.post('/splice-reemplazar', (req, res) => {
  items.splice(2, 2, 'Manteca', 'Café');
  res.json({ items });
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Servidor activo en http://localhost:${PORT}`);
});
