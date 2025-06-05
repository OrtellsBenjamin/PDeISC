
//Extraigo los elementos del DOM
const seccionBatalla = document.getElementById('campo-batalla');
const msjBatalla = document.getElementById('msj-batalla');
const imgAtaqueJugador = document.getElementById('img-ataque-jugador');
const imgAtaquePc = document.getElementById('img-ataque-pc');
const btnModo = document.getElementById('btn-cambiar-modo');
const turnoInfo = document.getElementById('turno-info');
const eleccionesJ1 = document.getElementById('elecciones-jugador1');
const eleccionesJ2 = document.getElementById('elecciones-jugador2');

const botonesJugador1 = document.querySelectorAll('[data-j1]');
const botonesJugador2 = document.querySelectorAll('[data-j2]');

//Defino las variables globales
let modoVsJugador = false;
let turno = 1;
let opcionJugador;
let opcionJugador2;
let opcionPc;


// Defino las imágenes y sus URLs
const imagenes = [
    { name: "Piedra", url: "/imagenes/piedra.png" },
    { name: "Papel", url: "/imagenes/papel.png" },
    { name: "Tijeras", url: "/imagenes/tijera.png" }
];

// Función que inicializa el juego, ocultando algunos elementos
function iniciar() {
  seccionBatalla.style.display = 'none';
  eleccionesJ2.style.display = 'none';
  turnoInfo.style.display = 'none';
}

// Función que genera un número aleatorio entre 0 y 2
function nAleatorio() {
  return Math.floor(Math.random() * 3);
}

// Función que obtiene la URL de la imagen según el nombre
function obtenerURL(nombre) {
  return imagenes.find(img => img.name === nombre)?.url;
}

// Función que muestra las imágenes de los ataques en la sección de batalla
function mostrarImagenes(nombre1, nombre2) {
  imgAtaqueJugador.innerHTML = `<img class="img-batalla" src="${obtenerURL(nombre1)}" alt="${nombre1}">`;
  imgAtaquePc.innerHTML = `<img class="img-batalla" src="${obtenerURL(nombre2)}" alt="${nombre2}">`;
  seccionBatalla.style.display = 'flex';
}

// Función que maneja la lógica de la batalla entre dos jugadores o contra la PC
function batalla(j1, j2, esVsPc = false) {
  if (j1 === j2) {
    msjBatalla.innerText = "Empate";
  } else if (
    (j1 === "Piedra" && j2 === "Tijeras") ||
    (j1 === "Papel" && j2 === "Piedra") ||
    (j1 === "Tijeras" && j2 === "Papel")
  ) {
    msjBatalla.innerText = esVsPc ? "Ganaste!" : "Ganó Jugador 1!";
  } else {
    msjBatalla.innerText = esVsPc ? "Perdiste :(" : "Ganó Jugador 2!";
  }
  mostrarImagenes(j1, j2);
}

// Función que inicia el juego contra la PC
function jugarContraPc(eleccion) {
  opcionJugador = eleccion;
  opcionPc = imagenes[nAleatorio()].name;
  batalla(opcionJugador, opcionPc, true);
}

// Función que cambia entre los modos de juego: vs PC o 1 vs 1
// Se actualizan el texto del botón y la visibilidad de los elementos según el modo
function cambiarModo() {
  modoVsJugador = !modoVsJugador;
  if (modoVsJugador) {
    btnModo.textContent = "Cambiar a modo vs Máquina";
    turnoInfo.style.display = 'block';
    turnoInfo.textContent = "Turno del Jugador 1";
    seccionBatalla.style.display = 'none';
  } else {
    btnModo.textContent = "Cambiar a modo 1 vs 1";
    turnoInfo.style.display = 'none';
    eleccionesJ1.style.display = 'flex';  
    eleccionesJ2.style.display = 'none';
    seccionBatalla.style.display = 'none';
  }
  turno = 1;
  opcionJugador = null;
  opcionJugador2 = null;
}


// Función que maneja la selección del jugador 1 en modo 1 vs 1
function seleccionarJugador1(eleccion) {
  opcionJugador = eleccion;
  turno = 2;
  turnoInfo.textContent = "Turno del Jugador 2";
  eleccionesJ1.style.display = 'none';
  eleccionesJ2.style.display = 'flex';
  seccionBatalla.style.display = 'none';
}
// Función que maneja la selección del jugador 2 en modo 1 vs 1
// Se muestra el resultado de la batalla y oculta las elecciones del jugador 2
function seleccionarJugador2(eleccion) {
  opcionJugador2 = eleccion;
  turnoInfo.textContent = "Resultado";
  eleccionesJ2.style.display = 'none';
  eleccionesJ1.style.display = 'flex';
  turno = 1;
  batalla(opcionJugador, opcionJugador2, false);
}

// Función que convierte tecla a jugada según jugador
function teclaAJugada(tecla) {
  switch(tecla) {
    // Para el jugador 1: las teclas 1,2,3
    case '1': return "Piedra";
    case '2': return "Papel";
    case '3': return "Tijeras";

    //Para el Jugador 2: teclas 5,6,7
    case '5': return "Piedra";
    case '6': return "Papel";
    case '7': return "Tijeras";

    default: return null;
  }
}

// Escuchar teclado solo en modo 1 vs 1
document.addEventListener('keydown', (e) => {
  if (!modoVsJugador) return; // solo modo 1vs1
  
  const jugada = teclaAJugada(e.key);
  if (!jugada) return; // En caso de que la tecla no  sea válida

  if (turno === 1 && ['1','2','3'].includes(e.key)) {
    opcionJugador = jugada;
    turno = 2;
    turnoInfo.textContent = "Turno del Jugador 2";
  } else if (turno === 2 && ['5','6','7'].includes(e.key)) {
    opcionJugador2 = jugada;
    turno = 1;
    batalla(opcionJugador, opcionJugador2, false);
    turnoInfo.textContent = "Turno del Jugador 1";
  }
});


// Inicializar el juego al cargar la página y agregar eventos a los botones
window.addEventListener('load', iniciar);
btnModo.addEventListener('click', cambiarModo);


// Agregar eventos a los botones de selección de jugadas
//Se usa el atributo para identificar la jugada del jugador
botonesJugador1.forEach(btn => {
  btn.addEventListener('click', () => {
    const eleccion = btn.getAttribute('data-j1');
    modoVsJugador ? seleccionarJugador1(eleccion) : jugarContraPc(eleccion);
  });
});

// Agregar eventos a los botones de selección de jugadas del jugador 2
botonesJugador2.forEach(btn => {
  btn.addEventListener('click', () => {
    const eleccion = btn.getAttribute('data-j2');
    seleccionarJugador2(eleccion);
  });
});
