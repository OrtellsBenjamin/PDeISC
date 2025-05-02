document.addEventListener('DOMContentLoaded', () => {
  // Primero oculto todos los elementos al cargar la página
  ocultarTodos();

  //defino los eventos para cada botón y que al realizarse se muestre el componente correspondiente
  document.getElementById('btn1').addEventListener('click', () => mostrar('componente1'));
  document.getElementById('btn2').addEventListener('dblclick', () => mostrar('componente2'));
  document.getElementById('btn3').addEventListener('mouseover', () => mostrar('componente3'));
  document.getElementById('btn4').addEventListener('mouseout', () => mostrar('componente4'));
  document.getElementById('btn5').addEventListener('mousedown', () => mostrar('componente5'));
});


// Defino la función que oculta todos los componentes
function ocultarTodos() {
  document.querySelectorAll('.componente').forEach(sec => {
    sec.style.display = 'none';
  });
}

// Defino la función que muestra el componente correspondiente al botón que se ha pulsado
function mostrar(id) {
  ocultarTodos();
  document.getElementById(id).style.display = 'block';
}
