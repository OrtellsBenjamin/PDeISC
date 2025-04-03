// calculos.js

function sumar(a, b) {
    return a + b;
}

function restar(a, b) {
    return a - b;
}

function multiplicar(a, b) {
    return a * b;
}

function dividir(a, b) {
    return a / b;
}

// Se crean las variables que almacenan los resultados
var Suma = sumar(5, 4);
var Resta = restar(3, 6);
var Multiplicacion = multiplicar(2, 7);
var Division = dividir(20, 4);

// Exportamos las variables con los resultados
export { Suma, Resta, Multiplicacion, Division };
