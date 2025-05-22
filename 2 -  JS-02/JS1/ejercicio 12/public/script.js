let dataGlobal = {};

window.onload = () => {
  fetch('/datos')
    .then(res => res.json())
    .then(data => {
      dataGlobal = data;

      document.getElementById('array-numeros').textContent = data.numeros.join(', ');
      document.getElementById('array-precios').textContent = data.precios.map(p => `$${p.precio}`).join(', ');
    });

  document.getElementById('btn-sumar').addEventListener('click', () => {
    const total = dataGlobal.numeros.reduce((acc, num) => acc + num, 0);
    document.getElementById('resultado-suma').textContent = `Suma total: ${total}`;
  });

  document.getElementById('btn-multiplicar').addEventListener('click', () => {
    const producto = dataGlobal.numeros.reduce((acc, num) => acc * num, 1);
    document.getElementById('resultado-producto').textContent = `Producto total: ${producto}`;
  });

  document.getElementById('btn-precios').addEventListener('click', () => {
    const totalPrecios = dataGlobal.precios.reduce((acc, p) => acc + p.precio, 0);
    document.getElementById('resultado-precios').textContent = `Total precios: $${totalPrecios}`;
  });
};
