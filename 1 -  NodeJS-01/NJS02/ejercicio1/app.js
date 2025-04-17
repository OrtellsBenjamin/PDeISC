//importacion de modulos creados anterirormente
const obtenerHoraActual = require('./modulos/tiempo');
const { sumar, restar } = require('./modulos/calculo');
const saludar = require('./modulos/saludo');

// Ejecuto las funciones importadas y muestro los resultados en consola
console.log(saludar('Rodrigo'));
console.log(`Hora actual: ${obtenerHoraActual()}`);
console.log(`55 + 997 = ${sumar(55, 997)}`);
console.log(`112 - 443 = ${restar(112, 443)}`);
