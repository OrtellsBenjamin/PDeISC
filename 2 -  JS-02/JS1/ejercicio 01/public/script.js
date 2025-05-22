function actualizarVista(endpoint, formId, listaId, formData) {
  fetch(endpoint, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(formData)
  })
    .then(res => res.json())
    .then(data => {
      const key = Object.keys(data)[0];
      document.getElementById(listaId).textContent = data[key].join(', ');
    });
}

document.getElementById('form-fruta').addEventListener('submit', (e) => {
  e.preventDefault();
  const fruta = e.target.fruta.value;
  actualizarVista('/push-fruta', 'form-fruta', 'lista-frutas', { fruta });
  e.target.reset();
});

document.getElementById('form-amigo').addEventListener('submit', (e) => {
  e.preventDefault();
  const nombre = e.target.nombre.value;
  actualizarVista('/push-amigo', 'form-amigo', 'lista-amigos', { nombre });
  e.target.reset();
});

document.getElementById('form-numero').addEventListener('submit', (e) => {
  e.preventDefault();
  const numero = e.target.numero.value;
  actualizarVista('/push-numero', 'form-numero', 'lista-numeros', { numero });
  e.target.reset();
});