import express from "express";
import cors from "cors";
import mysql from "mysql2";

const app = express();
const PORT = 3000;

app.use(cors());
app.use(express.json());

const db = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: "",
  database: "loginbd",
});

db.connect((err) => {
  if (err) {
    console.error("Error al conectar a MySQL:", err);
  } else {
    console.log("Conectado a MySQL");
  }
});

app.post("/login", (req, res) => {
  const { username, password } = req.body;

  const query = "SELECT * FROM users WHERE username = ? AND password = ?";
  db.query(query, [username, password], (err, results) => {
    if (err) {
      console.error(err);
      res.status(500).json({ success: false, message: "Error en el servidor" });
      return;
    }

    if (results.length > 0) {
      const user = results[0];
      res.json({ success: true, message: "Acceso correcto", user });
    } else {
      res.json({ success: false, message: "Usuario o contraseña incorrectos" });
    }
  });
});

app.listen(PORT, () => {
  console.log(`🚀 Servidor backend corriendo en http://localhost:${PORT}`);
});
