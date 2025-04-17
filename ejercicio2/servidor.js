
// En este codigo creo un servidor HTTP en Node.js que sirve un archivo HTML
const http = require('http');
const fs = require('fs');
const path = require('path');

// aqui ingreso la ruta al archivo HTML que quiero mostrar
const rutaHTML = path.join(__dirname, 'index.html');

//Se crea el servidor
const servidor = http.createServer((req, res) => {
  // se lee el contenido del archivo HTML
  fs.readFile(rutaHTML, (err, contenido) => {
    if (err) {
        // Si hay un error al leer el archivo, se va a enviar una respuesta de error
      res.writeHead(500, { 'Content-Type': 'text/plain' });
      res.end('Error al cargar la página HTML');
    } else {
      res.writeHead(200, { 'Content-Type': 'text/html' });
      res.end(contenido);
    }
  });
});

// Se inicia el servidor en el puerto 3000
servidor.listen(3000, () => {
  console.log('Servidor iniciado en http://localhost:3000');
});
