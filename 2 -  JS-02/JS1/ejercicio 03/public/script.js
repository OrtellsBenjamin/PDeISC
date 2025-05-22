function actualizarVista(data) {
  document.getElementById('lista-colores').textContent = data.colores.join(', ');
  document.getElementById('lista-tareas').textContent = data.tareas.join(', ');
  document.getElementById('lista-usuarios').textContent = data.usuarios.join(', ');
}

window.onload = () => {
  fetch('/estado')
    .then(res => res.json())
    .then(actualizarVista);
};

document.getElementById('form-color').addEventListener('submit', e => {
  e.preventDefault();
  const color = document.getElementById('color').value;
  fetch('/unshift-color', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ color })
  }).then(() => {
    document.getElementById('color').value = '';
    return fetch('/estado');
  }).then(res => res.json()).then(actualizarVista);
});

document.getElementById('form-tarea').addEventListener('submit', e => {
  e.preventDefault();
  const tarea = document.getElementById('tarea').value;
  fetch('/unshift-tarea', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ tarea })
  }).then(() => {
    document.getElementById('tarea').value = '';
    return fetch('/estado');
  }).then(res => res.json()).then(actualizarVista);
});

document.getElementById('form-usuario').addEventListener('submit', e => {
  e.preventDefault();
  const usuario = document.getElementById('usuario').value;
  fetch('/unshift-usuario', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ usuario })
  }).then(() => {
    document.getElementById('usuario').value = '';
    return fetch('/estado');
  }).then(res => res.json()).then(actualizarVista);
});
