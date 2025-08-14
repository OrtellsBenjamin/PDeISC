import React, { useState } from "react";
import "./Formulario.css";

export default function Formulario() {
  const [nombre, setNombre] = useState("");
  const [bienvenida, setBienvenida] = useState("");

  const manejarSubmit = (e) => {
    e.preventDefault();
    if (nombre.trim()) {
      setBienvenida(`¡Bienvenido/a, ${nombre}!`);
    }
  };

  return (
    <div className="formulario">
      <form onSubmit={manejarSubmit}>
        <input
          type="text"
          placeholder="Ingresa tu nombre"
          value={nombre}
          onChange={(e) => setNombre(e.target.value)}
        />
        <button type="submit">Enviar</button>
      </form>
      {bienvenida && <h3>{bienvenida}</h3>}
    </div>
  );
}
