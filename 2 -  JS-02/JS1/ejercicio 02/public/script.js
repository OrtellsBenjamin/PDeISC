function popAnimal() {
  fetch('/pop-animal', { method: 'POST' })
    .then(res => res.json())
    .then(data => {
      document.getElementById('lista-animales').textContent = data.animales.join(', ');
      document.getElementById('animal-eliminado').textContent = data.eliminado || '';
    });
}

function popCompra() {
  fetch('/pop-compra', { method: 'POST' })
    .then(res => res.json())
    .then(data => {
      document.getElementById('lista-compras').textContent = data.compras.join(', ');
      document.getElementById('compra-eliminada').textContent = data.eliminado || '';
    });
}

function vaciarAnimales() {
  fetch('/vaciar-animales', { method: 'POST' })
    .then(res => res.json())
    .then(data => {
      document.getElementById('lista-animales').textContent = data.animales.join(', ');
      document.getElementById('animal-eliminado').textContent = '';
    });
}

window.onload = () => {
  fetch('/estado')
    .then(res => res.json())
    .then(data => {
      document.getElementById('lista-animales').textContent = data.animales.join(', ');
      document.getElementById('lista-compras').textContent = data.compras.join(', ');
    });
};
