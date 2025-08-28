import React from "react";
import HolaMundo from "./Componentes/HolaMundo/HolaMundo";
import TarjetaPresentacion from "./Componentes/TarjetaPresentacion/TarjetaPresentacion";
import Contador from "./Componentes/Contador/Contador";
import ListaTareas from "./Componentes/ListaTareas/ListaTareas";
import Formulario from "./Componentes/Formulario/Formulario";

export default function App() {
  return (
    <div className="container py-4">
      <div className="mb-4">
        <HolaMundo />
      </div>
      <div className="mb-4">
        <TarjetaPresentacion
          nombre="Juan"
          apellido="Pérez"
          profesion="Desarrollador Web"
          imagen="https://hireline.io/blog/wp-content/uploads/2022/07/habilidades-de-un-programador-1200x900.jpg "
        />
      </div>
      <div className="mb-4">
        <Contador />
      </div>
      <div className="mb-4">
        <ListaTareas />
      </div>
      <div className="mb-4">
        <Formulario />
      </div>
    </div>
  );
}