import React from "react";
import "./TarjetaPresentacion.css";

export default function Tarjeta({ nombre, apellido, profesion, imagen }) {
  return (
    <div className="tarjeta">
      <img src={imagen} alt={`${nombre} ${apellido}`} />
      <h2>{nombre} {apellido}</h2>
      <p>{profesion}</p>
    </div>
  );
}
