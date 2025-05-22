let dataGlobal = {};

window.onload = () => {
  fetch('/datos')
    .then(res => res.json())
    .then(data => {
      dataGlobal = data;

      document.getElementById('array-letras').textContent = data.letras.join(', ');
      document.getElementById('array-numeros').textContent = data.numeros.join(', ');
      document.getElementById('texto-original').textContent = data.texto;
    });

  document.getElementById('btn-letras').addEventListener('click', () => {
    const rev = [...dataGlobal.letras].reverse();
    document.getElementById('resultado-letras').textContent = rev.join(', ');
  });

  document.getElementById('btn-numeros').addEventListener('click', () => {
    const rev = [...dataGlobal.numeros].reverse();
    document.getElementById('resultado-numeros').textContent = rev.join(', ');
  });

  document.getElementById('btn-texto').addEventListener('click', () => {
    const invertido = dataGlobal.texto.split('').reverse().join('');
    document.getElementById('resultado-texto').textContent = invertido;
  });
};
