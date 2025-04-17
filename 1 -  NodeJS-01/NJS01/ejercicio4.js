//usamos import para traer a nuestro documento las funciones desde el ejercicio3
import{ sumar, restar, multiplicar, dividir} from './public/calculos.js'

//Se crean 4 variables,donde se almaceran los resultados de las operaciones
Suma = sumar(5,3);
Resta = restar(8,6)
Multiplicacion = multiplicar (3,11)
Division = dividir (30/5)


//Usando console.log se nos muestra por consola el valor de nuestras variables
console.log("El resultado de la suma es: " , Suma , "  de la resta es: " , Resta , "  de la multiplicacion es: " , Multiplicacion , " y de la division es: " , Division )

