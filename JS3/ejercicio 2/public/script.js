const inputArchivo = document.getElementById('inputArchivo');
const procesarBtn = document.getElementById('procesarBtn');
const descargarBtn = document.getElementById('descargarBtn');

let numerosUtilesGlobal = [];

//Cuando subimos un archivo, el boton procesar se habilita
inputArchivo.addEventListener('change', () => {
  procesarBtn.disabled = !inputArchivo.files.length;
});

//Cuando se detecte el evento, se procesa el archivo, y se verifica que no este vacio el campo
procesarBtn.addEventListener('click', () => {
  const archivo = inputArchivo.files[0];
  if (!archivo) return alert('Selecciona un archivo primero');


  //Se crea un nuevo lector de archivos, que guarda el contenido del mismo
  const reader = new FileReader();
  reader.onload = (e) => {
    const contenido = e.target.result;

    // Separo el texto en números usando espacios, comas o saltos de linea
    let numeros = contenido.split(/[\s,]+/).filter(x => x.trim() !== '');

    // Filtro los que son solo dígitos y empiezan y terminan con el mismo número
    let utiles = numeros.filter(num => {
      return /^\d+$/.test(num) && num[0] === num[num.length -1];
    });

    // Los vuelvo a convertir a números reales y ordeno de menor a mayor
    utiles = utiles.map(Number).sort((a,b) => a-b);


    //filtro los que no se encuentran en la lista de utiles
    let noUtiles = numeros.filter(num => !utiles.includes(Number(num)));

    //Se asigna el contenido que tendra cada uno de nuestros elementos HTML
    document.getElementById('numerosUtiles').textContent = utiles.join(', ') || 'Ninguno';
    document.getElementById('countUtiles').textContent = utiles.length;
    document.getElementById('countNoUtiles').textContent = noUtiles.length;
    const porcentaje = numeros.length > 0 ? ((utiles.length / numeros.length) * 100).toFixed(2) : 0;
    document.getElementById('porcentajeUtiles').textContent = porcentaje + '%';

    numerosUtilesGlobal = utiles;
    descargarBtn.disabled = utiles.length === 0;
  };
  reader.readAsText(archivo);
});

descargarBtn.addEventListener('click', () => {
  if (numerosUtilesGlobal.length === 0) return;


  // Se unen los numeros en un string, con un salto de linea
  const contenido = numerosUtilesGlobal.join('\n');

  //Se crea un archivo de texto en la memoria, con el contenido generado  
  const blob = new Blob([contenido], { type: 'text/plain' });
  //Se crea una URL temporal que apunta a este archivo blob
  const url = URL.createObjectURL(blob);
  //Creamos un elemento <a> invisible, y le asignamos como destino el enlace de la URL
  const a = document.createElement('a');
  a.href = url;
  //Cuando se haga click en el enlace se descargara automaticamente con ese nombre
  a.download = 'resultado_filtrado.txt';
  a.click();

  //Luego limpiamos la memoria temporal del navegador
  URL.revokeObjectURL(url);

});
