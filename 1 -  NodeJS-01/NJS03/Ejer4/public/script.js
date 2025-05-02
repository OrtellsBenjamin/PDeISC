
// creo los constantes para los botones y la zona de enlaces
document.addEventListener('DOMContentLoaded', () => {
  const zonaEnlaces = document.getElementById('zonaEnlaces');
  const info = document.getElementById('info');
  const btnCrear = document.getElementById('crearEnlace');
  const btnModificar = document.getElementById('modificarEnlaces');

  let contador = 1;

//creo 5 enlaces predeterminados
  crearEnlace();
  crearEnlace();
  crearEnlace();
  crearEnlace();
  crearEnlace();

  // Enlazo el boton con la funcion de crear enlace
  btnCrear.addEventListener('click', () => {
    crearEnlace();
  });

  // Cuando se presiona este boton se modifican todos los enlaces
  btnModificar.addEventListener('click', () => {
    const enlaces = zonaEnlaces.getElementsByTagName('a');
    info.innerHTML = '';

    //mediante un array de enlaces recorro uno por uno y los modifico cambiando el href y el texto
    Array.from(enlaces).forEach((enlace, index) => {
      enlace.href = 'https://youtube.com';
      enlace.textContent = `https://youtube.com`;
      info.innerHTML += `<p>Enlace ${index + 1} cambiado a https://youtube.com</p>`;
    });
  });

  // Creo una función para crear enlaces
  function crearEnlace() {
    const enlace = document.createElement('a');
    enlace.href = 'https://google.com';
    enlace.textContent = `https://google.com`;
    enlace.target = '_blank';
    enlace.style.display = 'block';
    zonaEnlaces.appendChild(enlace);

    info.innerHTML = `Se agregó el <strong>enlace ${contador}</strong> con href: <em>https://google.com</em>`;
    contador++;
  }
});
