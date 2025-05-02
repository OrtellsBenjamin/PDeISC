let h1;
let img;


// creo las funciones para los botones, como agregar, cambiar etc.

function agregarH1() {

    h1 = document.createElement('h1')
    h1.textContent= 'Hola DOM';
    document.getElementById('contenido').appendChild(h1);
}

function cambiarTexto() {
  if (h1) h1.textContent = 'Chau DOM';
}

function cambiarColor() {
  if (h1) h1.style.color = 'red';
}

function agregarImagen() {
    img = document.createElement('img');
    img.src = 'images/perro1.avif';
    img.style.width = '200px';
    document.getElementById('contenido').appendChild(img);
}

function cambiarImagen() {
  if (img) img.src = 'images/perro2.jpeg';
}

function cambiarTamano() {
  if (img) img.style.width = '400px';
}
