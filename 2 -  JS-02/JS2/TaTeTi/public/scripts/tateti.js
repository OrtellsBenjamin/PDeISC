// Esperar a que el documento esté listo
document.addEventListener('DOMContentLoaded', () => {
    const celdas = document.querySelectorAll('.cell');
    const jugadorActualDisplay = document.getElementById('current-player');
    const botonReiniciar = document.getElementById('reset-btn');
    const resultadoDisplay = document.getElementById('result');
    const botonHumano = document.getElementById('human-btn');
    const botonComputadora = document.getElementById('computer-btn');
    
    let jugadorActual = 'X';
    let estadoJuego = ['', '', '', '', '', '', '', '', ''];
    let juegoActivo = true;
    let vsComputadora = false;
    
    const condicionesGanadoras = [
        [0, 1, 2], [3, 4, 5], [6, 7, 8], // filas
        [0, 3, 6], [1, 4, 7], [2, 5, 8], // columnas
        [0, 4, 8], [2, 4, 6]             // diagonales
    ];
    
    // Iniciar el juego
    function iniciarJuego() {
        celdas.forEach(celda => {
            celda.addEventListener('click', manejarClicCelda);
        });
        
        botonReiniciar.addEventListener('click', reiniciarJuego);
        botonHumano.addEventListener('click', establecerModoHumano);
        botonComputadora.addEventListener('click', establecerModoComputadora);
        
        // Modo humano por defecto
        establecerModoHumano();
    }
    
    // Manejar clic en celda
    function manejarClicCelda(e) {
        const celdaClicada = e.target;
        const indiceCelda = parseInt(celdaClicada.getAttribute('data-index'));
        
        if (estadoJuego[indiceCelda] !== '' || !juegoActivo) {
            return;
        }
        
        // Jugada del humano
        realizarMovimiento(indiceCelda, jugadorActual);
        
        // Verificar resultado después del movimiento humano
        if (!verificarResultado() && juegoActivo && vsComputadora && jugadorActual === 'O') {
            // Turno de la computadora
            setTimeout(movimientoComputadora, 500);
        }
    }
    
    // Realizar movimiento
    function realizarMovimiento(indice, jugador) {
        estadoJuego[indice] = jugador;
        celdas[indice].textContent = jugador;
        celdas[indice].classList.add(jugador.toLowerCase());
    }
    
    // Movimiento de la computadora
    function movimientoComputadora() {
        if (!juegoActivo) return;
        
        // Estrategia simple:
        // 1. Primero intenta ganar
        // 2. Luego bloquea al jugador humano
        // 3. Si no, elige aleatoriamente
        
        let movimiento = encontrarMovimientoGanador('O') || // Intenta ganar
                        encontrarMovimientoGanador('X') || // Bloquea humano
                        encontrarMovimientoAleatorio();
        
        if (movimiento !== null) {
            realizarMovimiento(movimiento, 'O');
            verificarResultado();
        }
    }
    
    // Busca movimiento ganador
    function encontrarMovimientoGanador(jugador) {
        for (let i = 0; i < condicionesGanadoras.length; i++) {
            const [a, b, c] = condicionesGanadoras[i];
            const celdasLinea = [estadoJuego[a], estadoJuego[b], estadoJuego[c]];
            
            // Contar casillas del jugador y vacías
            const conteoJugador = celdasLinea.filter(celda => celda === jugador).length;
            const conteoVacias = celdasLinea.filter(celda => celda === '').length;
            
            if (conteoJugador === 2 && conteoVacias === 1) {
                // Encontrar casilla vacía en esta línea
                if (estadoJuego[a] === '') return a;
                if (estadoJuego[b] === '') return b;
                if (estadoJuego[c] === '') return c;
            }
        }
        return null;
    }
    
    // Encuentra movimiento aleatorio
    function encontrarMovimientoAleatorio() {
        const celdasVacias = [];
        estadoJuego.forEach((celda, indice) => {
            if (celda === '') celdasVacias.push(indice);
        });
        
        return celdasVacias.length > 0 ? 
            celdasVacias[Math.floor(Math.random() * celdasVacias.length)] : 
            null;
    }
    
    // Cambiar jugador
    function cambiarJugador() {
        jugadorActual = jugadorActual === 'X' ? 'O' : 'X';
        jugadorActualDisplay.textContent = jugadorActual;
    }
    
    // Verificar resultado
    function verificarResultado() {
        // Verificar victoria
        for (let i = 0; i < condicionesGanadoras.length; i++) {
            const [a, b, c] = condicionesGanadoras[i];
            
            if (estadoJuego[a] && estadoJuego[a] === estadoJuego[b] && estadoJuego[a] === estadoJuego[c]) {
                resultadoDisplay.textContent = estadoJuego[a] === 'X' ? 
                    (vsComputadora ? '¡Ganaste!' : '¡Jugador X ha ganado!') : 
                    (vsComputadora ? '¡La computadora ganó!' : '¡Jugador O ha ganado!');
                juegoActivo = false;
                return true;
            }
        }
        
        // Verificar empate
        if (!estadoJuego.includes('')) {
            resultadoDisplay.textContent = '¡Empate!';
            juegoActivo = false;
            return true;
        }
        
        // Cambiar jugador si no hay resultado
        cambiarJugador();
        return false;
    }
    
    // Reiniciar juego
    function reiniciarJuego() {
        jugadorActual = 'X';
        estadoJuego = ['', '', '', '', '', '', '', '', ''];
        juegoActivo = true;
        resultadoDisplay.textContent = '';
        jugadorActualDisplay.textContent = jugadorActual;
        
        celdas.forEach(celda => {
            celda.textContent = '';
            celda.classList.remove('x', 'o');
        });
    }
    
    // Modo contra humano
    function establecerModoHumano() {
        vsComputadora = false;
        botonHumano.classList.add('active');
        botonComputadora.classList.remove('active');
        reiniciarJuego();
    }
    
    // Modo contra computadora
    function establecerModoComputadora() {
        vsComputadora = true;
        botonComputadora.classList.add('active');
        botonHumano.classList.remove('active');
        reiniciarJuego();
    }
    
    // Comenzar el juego
    iniciarJuego();
});