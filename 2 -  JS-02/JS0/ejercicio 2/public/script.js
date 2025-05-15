
//Espero a que el DOM esté completamente cargado, y defino constantes  
document.addEventListener('DOMContentLoaded', () => {
  const form = document.getElementById('formulario');
  const resultados = document.getElementById('resultados');

  form.addEventListener('submit', (e) => {
    e.preventDefault();

    // Obtengo los valores de los campos del formulario
    const producto = document.getElementById('producto').value;
    const categoria = document.getElementById('categoria').value;
    const precio = document.getElementById('precio').value;
    
    const disponibilidadSeleccionada = document.querySelector('input[name="disponible"]:checked');
    const disponible = disponibilidadSeleccionada ? disponibilidadSeleccionada.value : 'No especificado';

    // En resultados muestro los valores obtenidos
    resultados.innerHTML = `
      <p><strong>Producto:</strong> ${producto}</p>
      <p><strong>Categoría:</strong> ${categoria}</p>
      <p><strong>Precio:</strong> $${precio}</p>
      <p><strong>Disponible:</strong> ${disponible}</p>
    `;
  });
});
