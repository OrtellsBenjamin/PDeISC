let dataGlobal = {};

window.onload = () => {
  fetch('/datos')
    .then(res => res.json())
    .then(data => {
      dataGlobal = JSON.parse(JSON.stringify(data)); // para mantener una copia original
      renderOriginal(data);
    });

  document.getElementById('btn-numeros').addEventListener('click', () => {
    const ordenados = [...dataGlobal.numeros].sort((a, b) => a - b);
    document.getElementById('resultado-numeros').textContent = ordenados.join(', ');
  });

  document.getElementById('btn-palabras').addEventListener('click', () => {
    const ordenadas = [...dataGlobal.palabras].sort();
    document.getElementById('resultado-palabras').textContent = ordenadas.join(', ');
  });

  document.getElementById('btn-personas').addEventListener('click', () => {
    const ordenados = [...dataGlobal.personas].sort((a, b) => a.edad - b.edad);
    document.getElementById('resultado-personas').textContent = ordenados.map(p => `${p.nombre} (${p.edad})`).join(', ');
  });
};

function renderOriginal(data) {
  document.getElementById('array-numeros').textContent = data.numeros.join(', ');
  document.getElementById('array-palabras').textContent = data.palabras.join(', ');
  document.getElementById('array-personas').textContent = data.personas.map(p => `${p.nombre} (${p.edad})`).join(', ');
}
