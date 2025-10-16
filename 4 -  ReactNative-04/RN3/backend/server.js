import express from "express";
import cors from "cors";
import mysql from "mysql2";
import dotenv from "dotenv";
import bcrypt from "bcrypt";
import { OAuth2Client } from "google-auth-library";

dotenv.config();

const app = express();
const PORT = 3000;

app.use(cors());
app.use(express.json());

const db = mysql.createConnection({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
});

db.connect((err) => {
  if (err) {
    console.error("Error al conectar a MySQL:", err);
  } else {
    console.log("Conectado a MySQL");
  }
});

const CLIENT_ID = process.env.GOOGLE_CLIENT_ID;
const CLIENT_SECRET = process.env.GOOGLE_CLIENT_SECRET;
const REDIRECT_URI = "http://localhost:8081/auth/callback";

const client = new OAuth2Client(CLIENT_ID, CLIENT_SECRET, REDIRECT_URI);

// Login tradicional
app.post("/login", (req, res) => {
  const { username, password } = req.body;

  const query = "SELECT * FROM users WHERE username = ?";
  db.query(query, [username], async (err, results) => {
    if (err) {
      return res.status(500).json({ success: false, message: "Error en el servidor" });
    }

    if (results.length === 0) {
      return res.json({ success: false, message: "Usuario no encontrado" });
    }

    const user = results[0];
    const isMatch = await bcrypt.compare(password, user.password);

    if (isMatch) {
      // No devolver password al frontend
      delete user.password;
      res.json({ success: true, message: "Login correcto", user });
    } else {
      res.json({ success: false, message: "Contraseña incorrecta" });
    }
  });
});

// Login con Google OAuth2
app.post("/auth/google/callback", async (req, res) => {
  const { code } = req.body;

  if (!code) {
    return res.status(400).json({ success: false, message: "No se recibió el código de autorización" });
  }

  try {
    const { tokens } = await client.getToken(code);
    client.setCredentials(tokens);

    const ticket = await client.verifyIdToken({
      idToken: tokens.id_token,
      audience: CLIENT_ID,
    });

    const payload = ticket.getPayload();
    const email = payload.email;
    const username = payload.name || email.split("@")[0];

    // Buscar usuario por email
    const query = "SELECT * FROM users WHERE email = ?";
    db.query(query, [email], async (err, results) => {
      if (err) {
        return res.status(500).json({ success: false, message: "Error en el servidor" });
      }

      if (results.length === 0) {
        // Crear usuario nuevo
        const newUser = {
          username: username,
          email: email,
          password: await bcrypt.hash(process.env.DEFAULT_PASSWORD || "defaultpassword", 10),
        };

        const insertQuery = "INSERT INTO users SET ?";
        db.query(insertQuery, newUser, (err, result) => {
          if (err) {
            return res.status(500).json({ success: false, message: "Error al crear usuario" });
          }
          delete newUser.password; // no enviar password al cliente
          return res.json({ success: true, message: "Usuario creado y autenticado", user: newUser });
        });
      } else {
        const user = results[0];
        delete user.password;
        return res.json({ success: true, message: "Login correcto", user });
      }
    });
  } catch {
    return res.status(401).json({ success: false, message: "Código inválido o expirado" });
  }
});

app.listen(PORT, () => {
  console.log(`Servidor backend en http://localhost:${PORT}`);
});
