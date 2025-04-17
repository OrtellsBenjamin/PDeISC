// Requerimos los módulos
//http para crear un servidor web
const http = require('http');
//upper-case para convertir texto a mayúsculas
const uc = require('upper-case');
//chalk para dar color a la salida en consola
const chalk = require('chalk');
//figlet para crear arte ASCII a partir de un texto que ingresemos
const figlet = require('figlet');

// Creamos el servidor HTTP
http.createServer(function (req, res) {
  //Se configura la cabecera de la respuesta HTTP
  res.writeHead(200, {'Content-Type': 'text/html'});

  // Creamos el texto que queremos que se nos muestre
  const textoOriginal = "¡Hola Mundo!";
  const textoEnMayusculas = uc.upperCase(textoOriginal);

  // Usamos `figlet` para crear un arte ASCII con el texto
  figlet(textoEnMayusculas, function(err, data) {
    if (err) {
      res.write("Error al generar el arte ASCII.");
      res.end();
      return;
    }

    // Se envia el resultado al navegador
    res.write('<pre>' + data + '</pre>');  // Muestra el arte ASCII en el navegador

    // Usamos `chalk` para mostrar el arte en consola con un color personalizado en este caso azul
    console.log(chalk.blue(data));

    res.end();
  });

//inicamos el servidor, y mostramos por consola en color verde la URL donde se está ejecutando el servidor
}).listen(8080, function() {
  console.log(chalk.green('Servidor corriendo en http://localhost:8080'));
});
