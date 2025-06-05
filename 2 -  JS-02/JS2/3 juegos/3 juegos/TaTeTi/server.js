const express = require('express');
const path = require('path');
const app = express();
const PORT = 3000;

// Configuración de EJS
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

// Middleware
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, 'public')));

// Base de datos temporal
const personas = [];

// Rutas
app.get('/', (req, res) => {
  res.render('index', { 
    success: req.query.success === 'true',
    email: req.query.email || null
  });
});

app.post('/enviar', (req, res) => {
  const { email, pass } = req.body;
  personas.push({ email, pass });
  console.log('Nuevo registro:', { email, pass });
  
  res.redirect(`/?success=true&email=${encodeURIComponent(email)}`);
});

app.get('/personas', (req, res) => {
  res.render('listado', { 
    personas: personas,
    title: 'Listado de Usuarios Registrados'
  });
});

app.listen(PORT, () => {
  console.log(`Servidor funcionando en http://localhost:${PORT}`);
});