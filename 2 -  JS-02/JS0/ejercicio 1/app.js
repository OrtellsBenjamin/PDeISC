// defino las constantes 
const express = require('express');
const app = express();
const path = require('path');
const port = 3000;
const personas = [];

// me permite procesar los datos del formulario, y se sirve de contenido de la carpeta public
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));

app.get('/', (req, res) => {
  //Envío el archivo HTML del formulario al cliente
  res.sendFile(path.join(__dirname, 'views', 'index.html'));
});


app.listen(port, () => {
  console.log(`Servidor en http://localhost:${port}`);
});

app.post('/enviar', (req, res) => {


// Defino la estructura de mi array
const nuevaPersona = {
    Nombre: req.body.nombre,
    Apellido: req.body.apellido,
    Usuario: req.body.usuario,
    Contraseña: req.body.contraseña,
  
  };

//cargo el objeto en el array
  personas.push(nuevaPersona);
  console.log(personas);
  res.send('Usuario ingresado correctamente');
});

// Defino la ruta para ver la lista de usuarios
app.get('/personas', (req, res) => {
  let lista = '<h1>Lista de Usuarios</h1><ul>';
    personas.forEach(p => {
    lista += `<li>${p.Usuario}</li>`;
  });
  lista += '</ul>';
  res.send(lista);
});


