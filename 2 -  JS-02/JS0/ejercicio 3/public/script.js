// Defino constantes que acceden a los elementos del DOM
const form = document.getElementById("personaForm");
const mensaje = document.getElementById("mensaje");
const lista = document.getElementById("listaPersonas");
const tieneHijosCheckbox = document.getElementById("tieneHijos");
const cantidadHijos = document.getElementById("cantidadHijos");

// Con esta función muestro u oculto el campo cantidad de hijos
tieneHijosCheckbox.addEventListener("change", () => {
  cantidadHijos.style.display = tieneHijosCheckbox.checked ? "inline" : "none";
  cantidadHijos.required = tieneHijosCheckbox.checked;
});

// Capturo el evento submit del formulario
form.addEventListener("submit", async (e) => {
  e.preventDefault(); // Evito el comportamiento por defecto

  const formData = new FormData(form);
  const datos = Object.fromEntries(formData.entries());

  // Si tiene hijos, agrego los datos correspondientes
  if (tieneHijosCheckbox.checked) {
    datos.tieneHijos = true;
    datos.cantidadHijos = cantidadHijos.value;
  } else {
    datos.tieneHijos = false;
    datos.cantidadHijos = 0;
  }

  // Con esta función realizo validaciones adicionales antes de enviar
  if (!validarDatos(datos)) return;

  try {
    // Envío los datos al servidor usando fetch
    const res = await fetch("/guardar", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(datos)
    });

    const result = await res.json();

    // Muestro mensaje en pantalla según el resultado
    mensaje.textContent = result.mensaje;
    mensaje.style.color = result.ok ? "green" : "red";

    if (result.ok) {
      form.reset(); // Limpio el formulario
      cantidadHijos.style.display = "none";
      cargarPersonas(); // Recargo la lista de personas
    }

  } catch (error) {
    mensaje.textContent = "Error al guardar datos.";
    mensaje.style.color = "red";
  }
});

function validarDatos(datos) {
  // Valido la fecha de nacimiento entre 1930 y el año actual
  const fecha = new Date(datos.fechaNacimiento);
  const anio = fecha.getFullYear();
  const anioActual = new Date().getFullYear();
  if (anio < 1930 || anio > anioActual) {
    mensaje.textContent = "La fecha de nacimiento debe ser entre 1930 y el año actual.";
    mensaje.style.color = "red";
    return false;
  }


  // Valido el teléfono: solo números y entre 7 y 15 dígitos
  const telRegex = /^[0-9]{7,15}$/;
  if (!telRegex.test(datos.telefono)) {
    mensaje.textContent = "El teléfono debe contener solo números (7 a 15 dígitos).";
    mensaje.style.color = "red";
    return false;
  }

  // Valido el documento: alfanumérico de 5 a 15 caracteres
  const docRegex = /^[A-Za-z0-9]{5,15}$/;
  if (!docRegex.test(datos.documento)) {
    mensaje.textContent = "Documento inválido (solo letras y números, 5 a 15 caracteres).";
    mensaje.style.color = "red";
    return false;
  }

  // Validación cantidad de hijos (si corresponde)
  if (datos.tieneHijos && (parseInt(datos.cantidadHijos) < 1 || isNaN(parseInt(datos.cantidadHijos)))) {
    mensaje.textContent = "Indique una cantidad válida de hijos.";
    mensaje.style.color = "red";
    return false;
  }

  return true; 
}

// Con esta función cargo desde el servidor el listado de personas registradas
async function cargarPersonas() {
  const res = await fetch("/personas");
  const personas = await res.json();
  lista.innerHTML = "";
  personas.forEach(p => {
    const li = document.createElement("li");
    li.textContent = `${p.nombre} ${p.apellido}`;
    lista.appendChild(li);
  });
}

// Llamo a la función cuando carga la página por primera vez
cargarPersonas();
