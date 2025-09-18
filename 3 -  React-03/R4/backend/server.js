import express from "express";
import cors from "cors";
import mysql from "mysql2/promise";

const app = express();
app.use(cors());
app.use(express.json());


const db = await mysql.createPool({
  host: "localhost",
  user: "root",
  password: "",
  database: "portfolio_db",
});


app.get("/api/hero", async (req, res) => {
  try {
    const [rows] = await db.query("SELECT * FROM hero LIMIT 1");
    res.json(rows[0] || { heroText: "" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Error al obtener Hero" });
  }
});

app.post("/api/hero", async (req, res) => {
  try {
    const { heroText } = req.body;
    await db.query(
      "INSERT INTO hero (id, heroText) VALUES (1, ?) ON DUPLICATE KEY UPDATE heroText=?",
      [heroText, heroText]
    );
    res.json({ message: "Hero guardado correctamente" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Error al guardar Hero" });
  }
});


app.get("/api/about", async (req, res) => {
  try {
    const [rows] = await db.query("SELECT * FROM about LIMIT 1");
    res.json(rows[0] || { aboutText: "" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Error al obtener About" });
  }
});

app.post("/api/about", async (req, res) => {
  try {
    const { aboutText } = req.body;
    await db.query("UPDATE about SET aboutText=? WHERE id=1", [aboutText]);
    res.json({ message: "About guardado correctamente" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Error al guardar About" });
  }
});


app.get("/api/projects", async (req, res) => {
  try {
    const [rows] = await db.query("SELECT * FROM projects");
    const parsed = rows.map((r) => ({ ...r, tech: JSON.parse(r.tech) }));
    res.json(parsed);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Error al obtener proyectos" });
  }
});

app.delete("/api/projects/:id", async (req, res) => {
  try {
    const { id } = req.params;
    if (!id) return res.status(400).json({ error: "ID de proyecto requerido" });

    await db.query("DELETE FROM projects WHERE id=?", [id]);
    res.json({ message: "Proyecto eliminado correctamente", id });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Error al eliminar proyecto" });
  }
});


app.post("/api/projects", async (req, res) => {
  try {
    const projects = req.body;
    const savedProjects = [];

    for (const proj of projects) {
      let result;
      if (proj.id) {
     
        await db.query(
          "UPDATE projects SET title=?, description=?, image=?, tech=?, link_code=? WHERE id=?",
          [
            proj.title,
            proj.description,
            proj.image,
            JSON.stringify(proj.tech),
            proj.link_code || "#",
            proj.id,
          ]
        );
        result = await db.query("SELECT * FROM projects WHERE id=?", [proj.id]);
      } else {
     
        const [insertResult] = await db.query(
          "INSERT INTO projects (title, description, image, tech, link_code) VALUES (?, ?, ?, ?, ?)",
          [
            proj.title,
            proj.description,
            proj.image,
            JSON.stringify(proj.tech),
            proj.link_code || "#",
          ]
        );
        result = await db.query("SELECT * FROM projects WHERE id=?", [insertResult.insertId]);
      }
      const [row] = result;
      savedProjects.push({ ...row[0], tech: JSON.parse(row[0].tech) });
    }

    res.json({ message: "Proyectos guardados correctamente", projects: savedProjects });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Error al guardar los proyectos" });
  }
});

app.get("/api/experience", async (req, res) => {
  try {
    const [rows] = await db.query("SELECT * FROM experience");
    res.json(rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Error al obtener experiencia" });
  }
});

app.post("/api/experience", async (req, res) => {
  try {
    const { role, company, date, description, link } = req.body;
    const [result] = await db.query(
      "INSERT INTO experience (role, company, date, description, link) VALUES (?, ?, ?, ?, ?)",
      [role, company, date, description, link]
    );
    const [newExp] = await db.query("SELECT * FROM experience WHERE id=?", [result.insertId]);
    res.json(newExp[0]);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Error al agregar experiencia" });
  }
});

app.put("/api/experience/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const { role, company, date, description, link } = req.body;
    await db.query(
      "UPDATE experience SET role=?, company=?, date=?, description=?, link=? WHERE id=?",
      [role, company, date, description, link, id]
    );
    const [updated] = await db.query("SELECT * FROM experience WHERE id=?", [id]);
    res.json(updated[0]);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Error actualizando experiencia" });
  }
});


app.delete("/api/experience/:id", async (req, res) => {
  try {
    const { id } = req.params;
    if (!id) return res.status(400).json({ error: "ID de experiencia requerido" });

    await db.query("DELETE FROM experience WHERE id=?", [id]);
    res.json({ message: "Experiencia eliminada correctamente", id });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Error al eliminar experiencia" });
  }
});

app.listen(3000, () => console.log("Servidor corriendo en puerto 3000"));
