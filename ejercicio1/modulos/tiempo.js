// Este módulo va a exportar una función que devuelve la hora actual en formato de cadena.

function obtenerHoraActual() {
    const ahora = new Date();
    return ahora.toLocaleTimeString();
  }
  
  module.exports = obtenerHoraActual;
  