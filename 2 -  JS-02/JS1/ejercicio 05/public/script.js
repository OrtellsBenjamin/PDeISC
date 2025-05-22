
function actualizarVista(data) {
  if ('letras' in data) {
    document.getElementById('lista-letras').textContent = data.letras.join(', ');
  }
  if ('nombres' in data) {
    document.getElementById('lista-nombres').textContent = data.nombres.join(', ');
  }
  if ('items' in data) {
    document.getElementById('lista-items').textContent = data.items.join(', ');
  }
}

window.onload = () => {
  fetch('/estado')
    .then(res => res.json())
    .then(actualizarVista);
};

document.getElementById('btn-eliminar-letras').addEventListener('click', () => {
  fetch('/splice-eliminar', { method: 'POST' })
    .then(res => res.json())
    .then(actualizarVista);
});

document.getElementById('btn-insertar-nombre').addEventListener('click', () => {
  fetch('/splice-insertar', { method: 'POST' })
    .then(res => res.json())
    .then(actualizarVista);
});

document.getElementById('btn-reemplazar-items').addEventListener('click', () => {
  fetch('/splice-reemplazar', { method: 'POST' })
    .then(res => res.json())
    .then(actualizarVista);
});
