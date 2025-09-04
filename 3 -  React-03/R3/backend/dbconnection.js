import mysql from "mysql2/promise";

export async function connectDB() {
  const connection = await mysql.createConnection({
    host: "localhost",
    user: "root",       
    password: "",       
    database: "trabajo3"
  });
  console.log("✅ Conexión a MySQL correcta");
  return connection;
}
