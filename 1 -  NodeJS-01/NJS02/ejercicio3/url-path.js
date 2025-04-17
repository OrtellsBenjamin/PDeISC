// Requerimos el módulo 'url' para trabajar con URLs
const url = require('url');

// Se define una URL de ejemplo 
const miURL = 'http://localhost:8080/default.htm?year=2017&month=february';

//Y se analiza la URL usando el método 'parse' del módulo 'url'
const parsed = url.parse(miURL);


//Se imprime el resultado en la consola
console.log('Pathname:', parsed.pathname);
