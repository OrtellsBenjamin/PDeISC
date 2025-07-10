import { CzooAnimal } from './animal.js';

const zooAnimals = [];

document.getElementById('animalForm').addEventListener('submit', function (e) {
    e.preventDefault();

    
    const id = parseInt(document.getElementById('idAnimal').value);
    const nombre = document.getElementById('nombre').value;
    const jaulaNumero = parseInt(document.getElementById('jaulaNumero').value);
    const idTypeAnimal = parseInt(document.getElementById('idTypeAnimal').value);
    const peso = parseFloat(document.getElementById('peso').value);

    try {
        
        if (isNaN(id) || !nombre || isNaN(jaulaNumero) || isNaN(idTypeAnimal) || isNaN(peso)) {
            mostrarMensaje('Todos los campos son obligatorios y deben ser válidos.');
            return;
        }
        const animal = new CzooAnimal(id, nombre, jaulaNumero, idTypeAnimal, peso);
        zooAnimals.push(animal);
        mostrarMensaje('Animal agregado correctamente');
        mostrarResultados();
        console.log(zooAnimals);
        this.reset();
    } catch (error) {
        mostrarMensaje(error.message);
    }
});

function mostrarMensaje(mensaje) {
    let div = document.getElementById('mensajes');
    if (!div) {
        div = document.createElement('div');
        div.id = 'mensajes';
        document.body.insertBefore(div, document.getElementById('resultados'));
    }
    div.textContent = mensaje;
}

function mostrarResultados() {
    console.log("Ejecutando mostrarResultados()");
    const div = document.getElementById("resultados");
    div.innerHTML = "";

    const countJaula5PesoMenor3 = zooAnimals.filter(a => a.jaulaNumero === 5 && a.peso < 3).length;
    div.innerHTML += `<p>Cantidad de animales en la jaula 5 con peso menor a 3kg: ${countJaula5PesoMenor3}</p>`;

    const countFelinos = zooAnimals.filter(a => a.idTypeAnimal === 1 && a.jaulaNumero >= 2 && a.jaulaNumero <= 5).length;
    div.innerHTML += `<p>Cantidad de felinos en jaulas del 2 al 5: ${countFelinos}</p>`;

    const animalJaula4Peso120 = zooAnimals.find(a => a.jaulaNumero === 4 && a.peso < 120);
    if (animalJaula4Peso120) {
        div.innerHTML += `<p>Animal en la jaula 4 con peso menor a 120: ${animalJaula4Peso120.nombre}</p>`;
    } else {
        div.innerHTML += `<p>No hay animales en la jaula 4 con peso menor a 120.</p>`;
    }

    let tablaHTML = `
        <h3 class="mt-4">Tabla de Animales</h3>
        <table class="table table-striped table-bordered mt-3">
            <thead class="table-success">
                <tr>
                    <th>ID</th>
                    <th>Nombre</th>
                    <th>Jaula</th>
                    <th>Tipo</th>
                    <th>Peso</th>
                </tr>
            </thead>
            <tbody>
    `;

    zooAnimals.forEach(a => {
        tablaHTML += `
            <tr>
                <td>${a.id}</td>
                <td>${a.nombre}</td>
                <td>${a.jaulaNumero}</td>
                <td>${a.idTypeAnimal}</td>
                <td>${a.peso}</td>
            </tr>`;
    });

    tablaHTML += `
            </tbody>
        </table>
    `;

    div.innerHTML += tablaHTML;
}
