window.addEventListener('DOMContentLoaded', () => {
    const listaNumerosSpan = document.getElementById('lista-numeros');
    const mensajeGuardarP = document.getElementById('mensaje-guardar');
    const formAgregarNumero = document.getElementById('form-agregar-numero');
    const numeroInput = document.getElementById('numero-input');
    const formGuardarNumeros = document.getElementById('form-guardar-numeros');
    const numerosOcultosInput = document.getElementById('numeros-ocultos');

    // Creó un array vacio para almacenar los números
    let numerosCargadosLocal = [];

    //Uso una función para actualizar la visualización de la lista de números
    const actualizarListaNumerosVisual = () => {
        listaNumerosSpan.textContent = numerosCargadosLocal.join(', ');
    };

    // Al cargar la página, me aseguro de que la lista visual esté correcta
    actualizarListaNumerosVisual();


    // Manejo el envío del formulario de agregar número
    formAgregarNumero.addEventListener('submit', (event) => {
        event.preventDefault(); // Evitar el envío tradicional del formulario

        //Tomo el valor del input y lo conveirto en un número
        const numero = parseInt(numeroInput.value);

        // En caso de que no sea un número muestro un mensaje de error con su estilo
        if (isNaN(numero)) {
            mensajeGuardarP.textContent = 'Por favor, ingresa un número válido.';
            mensajeGuardarP.style.color = 'red';
            return;
        }

        // No se permite ingresar más de 20 números
        if (numerosCargadosLocal.length >= 20) {
            mensajeGuardarP.textContent = 'Ya se han ingresado el máximo de 20 números.';
            mensajeGuardarP.style.color = 'red';
            return;
        }

        //Se agrega el número a nuestro array, y se limpia tanto el input como el mensaje
        numerosCargadosLocal.push(numero);
        actualizarListaNumerosVisual(); 
        numeroInput.value = '';
        mensajeGuardarP.textContent = ''; 
        mensajeGuardarP.style.color = '';
    });

    // Manejo el envío del formulario de guardar números
    formGuardarNumeros.addEventListener('submit', (event) => {
        // Antes de enviar, agrego todos los números en el input oculto
        numerosOcultosInput.value = JSON.stringify(numerosCargadosLocal);
        // El formulario se enviará normalmente, recargando la página
    });

    // Manejo de mensajes de la URL (para la acción de guardar)
    const params = new URLSearchParams(window.location.search);
    const mensaje = params.get("mensaje");
    
    if (mensaje === "ok") {
        mensajeGuardarP.textContent = "Archivo guardado con éxito.";
        mensajeGuardarP.style.color = "green";
        // Si el archivo se guardó, la lista local de números debe volver a estar vacia.
        numerosCargadosLocal = []; 
        actualizarListaNumerosVisual(); // SE Limpia la visualización
        window.history.replaceState({}, document.title, window.location.pathname); // Se limpia la URL
    } else if (mensaje === "error") {
        mensajeGuardarP.textContent = "Debe ingresar al menos 10 números.";
        mensajeGuardarP.style.color = "red";
        window.history.replaceState({}, document.title, window.location.pathname); // Limpiar la URL
    }
});