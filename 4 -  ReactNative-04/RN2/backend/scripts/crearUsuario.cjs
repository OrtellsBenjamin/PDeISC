const mysql = require("mysql2");
const bcrypt = require("bcrypt");

const username = "benja";
const plainPassword = "111";

function tieneNumeros(str) {
  return /\d/.test(str);
}

if (tieneNumeros(username)) {
  console.log("El nombre de usuario no puede contener números.");
  process.exit(1); 
}

const db = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: "",
  database: "loginbd",
});

const checkUserQuery = "SELECT COUNT(*) AS count FROM users WHERE username = ?";

db.query(checkUserQuery, [username], (err, results) => {
  if (err) {
    console.error("Error al consultar usuario:", err);
    db.end();
    return;
  }

  if (results[0].count > 0) {
    console.log(`El usuario "${username}" ya existe. No se puede crear.`);
    db.end();
    return;
  }

  bcrypt.hash(plainPassword, 10, (err, hashedPassword) => {
    if (err) {
      console.error("Error al hashear la contraseña:", err);
      db.end();
      return;
    }

    const insertQuery = "INSERT INTO users (username, password) VALUES (?, ?)";
    db.query(insertQuery, [username, hashedPassword], (err, result) => {
      if (err) {
        console.error("Error al insertar usuario:", err);
      } else {
        console.log("Usuario creado exitosamente.");
      }
      db.end();
    });
  });
});
