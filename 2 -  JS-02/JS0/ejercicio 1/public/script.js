document.addEventListener('DOMContentLoaded', () => {
  const form = document.getElementById('formulario');

  form.addEventListener('submit', async (event) => {
    event.preventDefault(); // Con esto evito la recarga de la página

    // Creo una constante con los datos del formulario
    const datos = {
      nombre: form.nombre.value,
      apellido: form.apellido.value,
      usuario: form.usuario.value,
      contraseña: form.contraseña.value
    };

    try {
      // Envio los datos al servidor usando fetch
      const respuesta = await fetch('/enviar', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(datos)
      });

      // Espero la respuesta del servidor con await
      const texto = await respuesta.text();
      alert(texto); // Muestro el mensaje del servidor
      form.reset(); // Limpio los campos del formulario
    } catch (error) {
      console.error('Error al enviar:', error);
      alert('Ocurrió un error al enviar los datos.');
    }
  });
});
