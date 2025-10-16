import { OAuth2Client } from "google-auth-library";
import mysql from "mysql2";
import dotenv from "dotenv";
import bcrypt from "bcrypt";

dotenv.config();

const client = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);


export const googleAuth = async (req, res) => {
  const { token } = req.body;

  try {
    const ticket = await client.verifyIdToken({
      idToken: token,
      audience: process.env.GOOGLE_CLIENT_ID,
    });

    const payload = ticket.getPayload();

    const email = payload.email;

    const query = "SELECT * FROM users WHERE email = ?";
    db.query(query, [email], async (err, results) => {
      if (err) {
        console.error(err);
        return res.status(500).json({ success: false, message: "Error en el servidor" });
      }

      if (results.length === 0) {
       
        const newUser = {
          username: email,
          email: email,
          password: await bcrypt.hash(process.env.DEFAULT_PASSWORD || "secret", 10),
       
        };

        const insertQuery = "INSERT INTO users SET ?";
        db.query(insertQuery, newUser, (err, insertResult) => {
          if (err) {
            console.error(err);
            return res.status(500).json({ success: false, message: "Error al crear usuario" });
          }

          return res.json({ success: true, message: "Usuario creado y logueado", user: newUser });
        });
      } else {
   
        return res.json({ success: true, message: "Login correcto", user: results[0] });
      }
    });
  } catch (error) {
    console.error(error);
    res.status(401).json({ success: false, message: "Token inválido" });
  }
};
