document.addEventListener("DOMContentLoaded", () => {
  const botonTit = document.getElementById("agregarTit");
  const botonSub = document.getElementById("agregarSub");
  const botonPar = document.getElementById("agregarPar");
  const botonImg = document.getElementById("agregarImg");
  const contenedor = document.getElementById("contenedor");


 //Los siguientes botones van a agregar diferentes elementos HTML al contenedor e ir sumandolos
  botonTit.addEventListener("click", () => {
  
    contenedor.innerHTML += `
      <h2>Un perro</h2>
    `;
  });
  botonSub.addEventListener("click", () => {
    contenedor.innerHTML += `
      <h3>Blanco y pequeño</h3>
    `;
  });
  botonPar.addEventListener("click", () => {
    contenedor.innerHTML += `
      <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit. Pellentesque laoreet cursus nunc, a pulvinar diam laoreet sed. Vestibulum porttitor risus quis gravida molestie. Vivamus in dapibus mauris. Ut tincidunt sit amet augue ac facilisis. Integer luctus tincidunt dignissim. Nunc quis eros fringilla, fringilla elit ornare, commodo tellus. Maecenas pretium augue ut massa imperdiet dictum. In feugiat, lectus in lacinia tempor, eros lacus dictum augue, facilisis hendrerit leo magna ut sapien. </p>
    `;
  });
  botonImg.addEventListener("click", () => {
    contenedor.innerHTML += `
      <img src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRlUIsR1zDEh4v8fnMXBYJbyW8AGKwrlWc-bw&s" alt="Imagen Agregada">
    `;
  });
});
