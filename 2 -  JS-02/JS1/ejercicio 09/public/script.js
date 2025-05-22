window.onload = () => {
  fetch('/estado')
    .then(res => res.json())
    .then(data => {
      document.getElementById('array-nombres').textContent = data.nombres.join(', ');
      document.getElementById('array-numeros').textContent = data.numeros.join(', ');

      const personasTexto = data.personas
        .map(p => `${p.nombre}: ${p.edad}`)
        .join(', ');
      document.getElementById('array-personas').textContent = personasTexto;

      const saludos = data.nombres.map(nombre => `Hola, ${nombre}!`);
      document.getElementById('saludos').innerHTML = saludos.join('<br>');

      const duplicados = [];
      data.numeros.forEach(num => duplicados.push(num * 2));
      document.getElementById('duplicados').innerHTML = duplicados.join(', ');

      const detalles = [];
      data.personas.forEach(p => {
        detalles.push(`${p.nombre} tiene ${p.edad} años.`);
      });
      document.getElementById('personas').innerHTML = detalles.join('<br>');
    })
    .catch(err => console.error('Error al obtener los datos:', err));
};
