
//importo el modulo que me permite crear el servidor, y el que incluye las funciones
import { createServer } from 'node:http';
import { Suma, Resta, Multiplicacion, Division } from './calculos.js'; 


const html = (Suma, Resta, Multiplicacion, Division) => `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Calculos</title>
        <link rel="stylesheet" href="estilo.css">
        <style>
        p{
        color: white;
        background-color: rgb(126, 14, 14);
        width: 33%;
        padding: 20px;
        border-radius: 20px;
}
        </style>
</head>
<body>
    <p id="ResultadoSuma" class="suma">Suma: ${Suma}</p>
    <p id="ResultadoResta">Resta: ${Resta}</p>
    <p id="ResultadoMultiplicacion">Multiplicación: ${Multiplicacion}</p>
    <p id="ResultadoDivision">División: ${Division}</p>
</body>
</html>`;


//se crea el servidor y se guarda en una variable
const server = createServer((req, res) => {

    res.writeHead(200, { 'Content-Type': 'text/html; charset=utf-8' });
    res.end(html(Suma, Resta, Multiplicacion, Division));  
});

server.listen(3000, '127.0.0.1', () => {
    console.log('Escuchando en 127.0.0.1:3000');
});
