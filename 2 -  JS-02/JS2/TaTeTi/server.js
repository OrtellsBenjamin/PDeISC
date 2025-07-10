const express = require('express');
const path = require('path');
const app = express();
const PORT = 3002;

// Configuración de EJS
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, 'public')));


const personas = [];

app.listen(PORT, () => {
  console.log(`Servidor funcionando en http://localhost:${PORT}`);
});