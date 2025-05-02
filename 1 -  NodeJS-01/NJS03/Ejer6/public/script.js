document.addEventListener('DOMContentLoaded', () => {
  const form = document.getElementById('formulario');
  const resultados = document.getElementById('resultados');

  form.addEventListener('submit', (e) => {
    e.preventDefault();


    // defino los const para cada campo del formulario
    const nombre = document.getElementById('nombre').value;
    const apellido = document.getElementById('apellido').value;
    const edad = document.getElementById('edad').value;
    const email = document.getElementById('email').value;
    const pais = document.getElementById('pais').value;

    const sexoSeleccionado = document.querySelector('input[name="sexo"]:checked');
    const sexo = sexoSeleccionado ? sexoSeleccionado.value : 'No seleccionado';

    const intereses = [];
    // obtengo los checkbox seleccionados
    if (document.getElementById('deporte').checked) intereses.push('Deporte');
    if (document.getElementById('musica').checked) intereses.push('Música');
    if (document.getElementById('arte').checked) intereses.push('Arte');


    // guardo la informacion ingresada en resultados, para mostrar por pantalla
    resultados.innerHTML = `
      <p><strong>Nombre:</strong> ${nombre}</p>
      <p><strong>Apellido:</strong> ${apellido}</p>
      <p><strong>Edad:</strong> ${edad}</p>
      <p><strong>Email:</strong> ${email}</p>
      <p><strong>Sexo:</strong> ${sexo}</p>
      <p><strong>País:</strong> ${pais}</p>
      <p><strong>Intereses:</strong> ${intereses.join(', ') || 'Ninguno'}</p>
    `;
  });
});
