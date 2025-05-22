window.onload = () => {
  fetch('/estado')
    .then(res => res.json())
    .then(data => {
      document.getElementById('numeros').textContent = data.numeros.join(', ');
      document.getElementById('peliculas').textContent = data.peliculas.join(', ');
      document.getElementById('frutas').textContent = data.frutas.join(', ');
    });
};

document.getElementById('btn-primeros').addEventListener('click', () => {
  fetch('/slice-primeros', { method: 'POST' })
    .then(res => res.json())
    .then(data => {
      document.getElementById('resultado-primeros').textContent = data.resultado.join(', ');
    });
});

document.getElementById('btn-peliculas').addEventListener('click', () => {
  fetch('/slice-peliculas', { method: 'POST' })
    .then(res => res.json())
    .then(data => {
      document.getElementById('resultado-peliculas').textContent = data.resultado.join(', ');
    });
});

document.getElementById('btn-ultimos').addEventListener('click', () => {
  fetch('/slice-ultimos', { method: 'POST' })
    .then(res => res.json())
    .then(data => {
      document.getElementById('resultado-ultimos').textContent = data.resultado.join(', ');
    });
});
