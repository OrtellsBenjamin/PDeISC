window.onload = () => {
  actualizarEstado();
};

function actualizarEstado() {
  fetch('/estado')
    .then(res => res.json())
    .then(data => {
      document.getElementById('roles').textContent = data.roles.join(', ');
      document.getElementById('colores').textContent = data.colores.join(', ');
      document.getElementById('numeros').textContent = data.numeros.join(', ');
    });
}

document.getElementById('btn-admin').addEventListener('click', () => {
  fetch('/verificar-admin', { method: 'POST' })
    .then(res => res.json())
    .then(data => {
      document.getElementById('resultado-admin').textContent = data.existe
        ? 'Admin está presente.'
        : 'Admin no está presente.';
    });
});

document.getElementById('btn-verde').addEventListener('click', () => {
  fetch('/verificar-verde', { method: 'POST' })
    .then(res => res.json())
    .then(data => {
      document.getElementById('resultado-verde').textContent = data.existe
        ? 'Verde está en la lista.'
        : 'Verde no está en la lista.';
    });
});

document.getElementById('form-numero').addEventListener('submit', (e) => {
  e.preventDefault();
  const numero = document.getElementById('numero-nuevo').value;
  fetch('/agregar-numero', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ numero }),
  })
    .then(res => res.json())
    .then(data => {
      document.getElementById('resultado-numero').textContent = data.agregado
        ? `Número agregado: ${numero}`
        : 'Ese número ya está en la lista.';
      actualizarEstado();
      document.getElementById('numero-nuevo').value = '';
    });
});
