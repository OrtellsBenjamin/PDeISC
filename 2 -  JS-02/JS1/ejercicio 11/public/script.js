let dataGlobal = {};

window.onload = () => {
  fetch('/datos')
    .then(res => res.json())
    .then(data => {
      dataGlobal = data;
      document.getElementById('array-numeros').textContent = data.numeros.join(', ');
      document.getElementById('array-palabras').textContent = data.palabras.join(', ');
      document.getElementById('array-usuarios').textContent = data.usuarios
        .map(u => u.nombre + (u.activo ? ' (activo)' : ' (inactivo)'))
        .join(', ');
    });

  document.getElementById('btn-numeros').addEventListener('click', () => {
    const mayores = dataGlobal.numeros.filter(n => n > 10);
    document.getElementById('resultado-numeros').textContent = mayores.join(', ');
  });

  document.getElementById('btn-palabras').addEventListener('click', () => {
    const largas = dataGlobal.palabras.filter(p => p.length > 5);
    document.getElementById('resultado-palabras').textContent = largas.join(', ');
  });

  document.getElementById('btn-usuarios').addEventListener('click', () => {
    const activos = dataGlobal.usuarios.filter(u => u.activo).map(u => u.nombre);
    document.getElementById('resultado-usuarios').textContent = activos.join(', ');
  });
};
