const express = require('express');
const app = express();
const fs = require('fs');
const path = require('path');
const port = 3000;

app.use(express.urlencoded({ extended: true }));

// Configuro Express para poder servir archivos estáticos desde la carpeta 'public'
app.use(express.static(path.join(__dirname, 'public')));


// Ruta para la página principal
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'index.html'));
});



app.post('/guardar-numeros', (req, res) => {
    const data = req.body.numerosAEnviar;

    // Validar que el dato exista y tenga formato básico de array JSON
    if (!data || typeof data !== 'string' || !data.trim().startsWith('[')) {
        console.error('Formato inválido en los datos recibidos.');
        return res.redirect('/?mensaje=error-formato');
    }

    let numerosRecibidos = JSON.parse(data);

    // Verificar que sea realmente un array
    if (!Array.isArray(numerosRecibidos)) {
        console.error('Los datos parseados no son un array.');
        return res.redirect('/?mensaje=error-formato');
    }

    if (numerosRecibidos.length < 10) {
        return res.redirect('/?mensaje=error');
    }

    //Se guardan todos los números recibidos, separados por comas
    const ruta = path.join(__dirname, 'numeros.txt');
    fs.writeFileSync(ruta, numerosRecibidos.join(', '));
    res.redirect('/?mensaje=ok');
});


app.listen(port, () => {
    console.log(`Servidor corriendo en http://localhost:${port}`);
});