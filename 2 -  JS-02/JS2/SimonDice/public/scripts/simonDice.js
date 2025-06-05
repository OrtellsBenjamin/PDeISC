document.addEventListener('DOMContentLoaded', function() {
    const flashColors = {
        green: '#6eff8a',
        red: '#ff7a7a',
        yellow: '#ebf19e',
        blue: '#7ac6ff'
    };
    
    const colorMap = {
        0: 'green',
        1: 'red',
        2: 'blue',
        3: 'yellow'
    };

    // Elementos del DOM
    const botonInicio = document.getElementById('start');
    const divMensaje = document.getElementById('display-mensaje');

    // Iniciar juego
    botonInicio.addEventListener('click', iniciarJuego);

    function iniciarJuego() {
        divMensaje.innerHTML = ``;
        coloresPulsados = [];
        coloresAPulsar = [];
        perdio = false;
        turnoComputadora = true;
        agregarColorSecuencia();
        mostrarSecuencia();
    }

    function agregarColorSecuencia() {
        const colorRandom = Math.floor(Math.random() * 4);
        coloresAPulsar.push(colorRandom);
    }

    function mostrarSecuencia() {
        let i = 0;
        const intervalo = setInterval(() => {
            if (i >= coloresAPulsar.length) {
                clearInterval(intervalo);
                turnoComputadora = false;
                return;
            }
            
            const colorId = colorMap[coloresAPulsar[i]];
            const boton = document.getElementById(colorId);
            const originalColor = boton.style.backgroundColor || window.getComputedStyle(boton).backgroundColor;
            
            boton.style.transition = 'background-color 0.3s ease-in-out';
            boton.style.backgroundColor = flashColors[colorId];
            
            setTimeout(() => {
                boton.style.backgroundColor = originalColor;
            }, 200);
            
            i++;
        }, 800);
    }

    // Event listeners para los botones de colores
    document.querySelectorAll('.simon-button').forEach(button => {
        button.addEventListener('click', function() {
            if (turnoComputadora) return;
            
            const colorId = this.id;
            const colorIndex = Object.values(colorMap).indexOf(colorId);
            coloresPulsados.push(colorIndex);
            
            // Efecto visual
            const originalColor = this.style.backgroundColor || window.getComputedStyle(this).backgroundColor;
            this.style.transition = 'background-color 0.3s ease-in-out';
            this.style.backgroundColor = flashColors[colorId];
            
            setTimeout(() => {
                this.style.backgroundColor = originalColor;
            }, 300);
            
            verificarColores();
        });
    });

    function verificarColores() {
        for (let i = 0; i < coloresPulsados.length; i++) {
            if (coloresPulsados[i] !== coloresAPulsar[i]) {
                perdio = true;
                divMensaje.innerHTML = `<div class="alert alert-secondary">Perdiste! Presiona iniciar Juego para volver a jugar</div>`;
                return;
            }
        }
        
        if (coloresPulsados.length === coloresAPulsar.length) {
            // El jugador completó la secuencia correctamente
            coloresPulsados = [];
            turnoComputadora = true;
            setTimeout(() => {
                agregarColorSecuencia();
                mostrarSecuencia();
            }, 1000);
        }
    }
});