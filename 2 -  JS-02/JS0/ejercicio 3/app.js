const express = require("express");
const app = express();
const PORT = 3000;

app.use(express.static("public"));
app.use(express.json());

let personas = [];

app.post("/guardar", (req, res) => {
  console.log("Datos recibidos:\n", JSON.stringify(req.body, null, 2));
  const persona = req.body;
  if (persona.nombre && persona.apellido) {
    personas.push(persona);
    res.json({ ok: true, mensaje: "Datos guardados correctamente." });
  } else {
    res.json({ ok: false, mensaje: "Faltan datos obligatorios." });
  }
});

app.get("/personas", (req, res) => {
  res.json(personas);
});

app.listen(PORT, () => {
  console.log(`Servidor corriendo en http://localhost:${PORT}`);
});
