
//defino las constantes que voy a usar, y cargo el evento DOMContentLoaded 
document.addEventListener('DOMContentLoaded', () => {
  const boton = document.getElementById('contarBtn');
  const contenedor = document.getElementById('contenedor');
  const resultado = document.getElementById('resultado');

  //agrego un evento al boton, que al hacer click cuenta los hijos del contenedor con children.lenght y lo muestra en el resultado
  boton.addEventListener('click', () => {
    const cantidadHijos = contenedor.children.length;
    resultado.textContent = `El contenedor tiene ${cantidadHijos} hijos.`;
  });
});
