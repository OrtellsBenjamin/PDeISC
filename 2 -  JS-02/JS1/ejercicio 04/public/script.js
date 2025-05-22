function actualizarVista(data) {
  if ('numeros' in data) {
    document.getElementById('lista-numeros').textContent = data.numeros.join(', ');
  }
  if ('mensajes' in data) {
    document.getElementById('lista-mensajes').textContent = data.mensajes.join(', ');
  }
  if ('colaAtencion' in data) {
    document.getElementById('lista-cola').textContent = data.colaAtencion.join(', ');
  }
}

window.onload = () => {
  fetch('/estado')
    .then(res => res.json())
    .then(actualizarVista);
};

document.getElementById('btn-shift-numero').addEventListener('click', () => {
  fetch('/shift-numero', { method: 'POST' })
    .then(res => res.json())
    .then(data => {
      actualizarVista(data);
      document.getElementById('eliminado-numero').textContent =
        data.eliminado !== null ? `Número eliminado: ${data.eliminado}` : 'No hay más números.';
    });
});

document.getElementById('btn-shift-mensaje').addEventListener('click', () => {
  fetch('/shift-mensaje', { method: 'POST' })
    .then(res => res.json())
    .then(data => {
      actualizarVista(data);
      document.getElementById('eliminado-mensaje').textContent =
        data.eliminado !== null ? `Mensaje eliminado: ${data.eliminado}` : 'No hay más mensajes.';
    });
});

document.getElementById('btn-shift-cola').addEventListener('click', () => {
  fetch('/shift-cola', { method: 'POST' })
    .then(res => res.json())
    .then(data => {
      actualizarVista(data);
      document.getElementById('atendido-cola').textContent =
        data.atendido !== null ? `Cliente atendido: ${data.atendido}` : 'No hay clientes en espera.';
    });
});
