import React, { useState } from "react";
import "./Contador.css";

export default function Contador() {
  const [contador, setContador] = useState(0);

  return (
    <div className="contador">
      <h2>Contador: {contador}</h2>
      <button onClick={() => setContador(contador - 1)}>-</button>
      <button onClick={() => setContador(contador + 1)}>+</button>
    </div>
  );
}
