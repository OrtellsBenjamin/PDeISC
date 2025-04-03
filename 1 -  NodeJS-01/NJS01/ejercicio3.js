
//A continuacion cree 4 funciones que piden 2 parametros, y estas retornan el resultado dependiendo la operacion elegida
function sumar (a,b){
    return a + b;
}

function restar (a,b){
    return a - b;
}

function multiplicar (a,b){
    return a * b;
}

function dividir (a,b){
    return a/b;
}

//Se crean 4 variables,donde se almaceran los resultados de las operaciones
var Suma = sumar (5,4)
var Resta = restar (3,6)
var Multiplicacion =  multiplicar (2,7)
var Division = dividir (20,4)

//Usando console.log se nos muestra por consola el valor de nuestras variables
console.log("El resultado de la suma es: " , Suma , "  de la resta es: " , Resta , "  de la multiplicacion es: " , Multiplicacion , " y de la division es: " , Division )
