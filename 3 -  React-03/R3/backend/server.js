import express from "express";
import cors from "cors";
import { connectDB } from "./dbconnection.js";

const app = express();
app.use(cors());
app.use(express.json());

const db = await connectDB();


app.get("/usuarios", async (req, res) => {
  const [rows] = await db.execute("SELECT * FROM usuarios");
  res.json(rows);
});


app.post("/usuarios", async (req, res) => {
  const { nombre, apellido, direccion, telefono, celular, fecha_nacimiento, email } = req.body;
  await db.execute(
    "INSERT INTO usuarios (nombre, apellido, direccion, telefono, celular, fecha_nacimiento, email) VALUES (?, ?, ?, ?, ?, ?, ?)",
    [nombre, apellido, direccion, telefono, celular, fecha_nacimiento, email]
  );
  res.json({ message: "Usuario agregado" });
});


app.put("/usuarios/:id", async (req, res) => {
  const { id } = req.params;
  const { nombre, apellido, direccion, telefono, celular, fecha_nacimiento, email } = req.body;
  await db.execute(
    "UPDATE usuarios SET nombre=?, apellido=?, direccion=?, telefono=?, celular=?, fecha_nacimiento=?, email=? WHERE id=?",
    [nombre, apellido, direccion, telefono, celular, fecha_nacimiento, email, id]
  );
  res.json({ message: "Usuario actualizado" });
});


app.delete("/usuarios/:id", async (req, res) => {
  const { id } = req.params;
  await db.execute("DELETE FROM usuarios WHERE id=?", [id]);
  res.json({ message: "Usuario eliminado" });
});

app.listen(3002, () => {
  console.log("🚀 Servidor corriendo en http://localhost:3002/usuarios");
});
