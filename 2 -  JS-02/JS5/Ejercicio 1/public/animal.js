export class CzooAnimal{
    constructor(id, nombre, jaulaNumero, idTypeAnimal, peso) {
        this._id = id;
        this._nombre = nombre;
        this._jaulaNumero = jaulaNumero;
        this._idTypeAnimal = idTypeAnimal;
        this._peso = peso;
    }

 get id() {
    return this._id;
}

get nombre() {
    return this._nombre;
}

get jaulaNumero() {
    return this._jaulaNumero;
}
get idTypeAnimal() {
    return this._idTypeAnimal;
}
get peso() {
    return this._peso;
}

set id(value) {
    this._id = value;
}

set nombre(value) {
    this._nombre = value;
}
set jaulaNumero(value) {
    this._jaulaNumero = value;
}

set idTypeAnimal(value) {
    this._idTypeAnimal = value;
}

set peso(value) {
    if (value < 0) {
        throw new Error("El peso no puede ser negativo");
    }
    else{
    this._peso = value;
    }
}


}
