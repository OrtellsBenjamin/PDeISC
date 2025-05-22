window.onload = () => {
  fetch('/datos')
    .then(res => res.json())
    .then(data => {

      document.getElementById('array-numeros').textContent = data.numeros.join(', ');
      document.getElementById('array-nombres').textContent = data.nombres.join(', ');
      document.getElementById('array-precios').textContent = data.precios.join(', ');

    
      const numerosPor3 = data.numeros.map(num => num * 3);
      document.getElementById('numeros-por-3').textContent = numerosPor3.join(', ');

     
      const nombresMayus = data.nombres.map(nombre => nombre.toUpperCase());
      document.getElementById('nombres-mayusculas').textContent = nombresMayus.join(', ');

    
      const preciosConIVA = data.precios.map(precio => (precio * 1.21).toFixed(2));
      document.getElementById('precios-con-iva').textContent = preciosConIVA.join(', ');
    })
    .catch(err => console.error('Error al obtener datos:', err));
};
