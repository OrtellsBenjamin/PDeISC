window.onload = () => {
  fetch('/estado')
    .then(res => res.json())
    .then(data => {
      document.getElementById('animales').textContent = data.animales.join(', ');
      document.getElementById('numeros').textContent = data.numeros.join(', ');
      document.getElementById('ciudades').textContent = data.ciudades.join(', ');
    });
};

document.getElementById('btn-palabra').addEventListener('click', () => {
  fetch('/buscar-palabra', { method: 'POST' })
    .then(res => res.json())
    .then(data => {
      const msg = data.index !== -1 ? `Se encuentra en la posición ${data.index}` : 'No se encontró';
      document.getElementById('resultado-palabra').textContent = msg;
    });
});

document.getElementById('btn-numero').addEventListener('click', () => {
  fetch('/buscar-numero', { method: 'POST' })
    .then(res => res.json())
    .then(data => {
      const msg = data.index !== -1 ? `Se encuentra en la posición ${data.index}` : 'No se encontró';
      document.getElementById('resultado-numero').textContent = msg;
    });
});

document.getElementById('btn-ciudad').addEventListener('click', () => {
  fetch('/buscar-ciudad', { method: 'POST' })
    .then(res => res.json())
    .then(data => {
      const msg = data.index !== -1 ? `Está en la posición ${data.index}` : 'Madrid no está en la lista';
      document.getElementById('resultado-ciudad').textContent = msg;
    });
});
