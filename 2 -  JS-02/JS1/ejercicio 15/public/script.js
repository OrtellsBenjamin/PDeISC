const form = document.getElementById('formulario');
const resultado = document.getElementById('resultado');
const mensajeDecodificado = document.getElementById('mensajeDecodificado');

form.addEventListener('submit', async e => {
  e.preventDefault();

  const mensaje = form.mensaje.value.trim();
  if (!mensaje) return;

  try {
    const res = await fetch('/decodificar', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ mensaje })
    });

    const data = await res.json();
    mensajeDecodificado.textContent = data.decodificado;
    resultado.style.display = 'block';
  } catch (error) {
    mensajeDecodificado.textContent = 'Error al decodificar mensaje.';
    resultado.style.display = 'block';
  }
});
