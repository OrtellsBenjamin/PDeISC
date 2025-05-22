const express = require('express');
const fs = require('fs');
const path = require('path');

const app = express();
const PORT = 3000;

app.use(express.static('public'));
app.use(express.json());

function decodificarMensaje(texto) {
  const stack = [];
  for (const char of texto) {
    if (char === ')') {
      let fragmento = '';
      while (stack.length && stack[stack.length - 1] !== '(') {
        fragmento = stack.pop() + fragmento;
      }
      stack.pop(); 
      const invertido = fragmento.split('').reverse().join('');
      for (const c of invertido) {
        stack.push(c);
      }
    } else {
      stack.push(char);
    }
  }
  return stack.join('');
}

app.post('/decodificar', (req, res) => {
  const mensaje = req.body.mensaje;

  
  fs.writeFileSync(path.join(__dirname, 'SECRETO.IN'), mensaje, 'utf8');

  const decodificado = decodificarMensaje(mensaje);


  fs.writeFileSync(path.join(__dirname, 'SECRETO.OUT'), decodificado, 'utf8');

  res.json({ decodificado });
});

app.listen(PORT, () => {
  console.log(`Servidor corriendo en http://localhost:${PORT}`);
});
