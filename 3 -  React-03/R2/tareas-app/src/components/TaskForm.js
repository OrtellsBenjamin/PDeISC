import { useState } from "react";
import { useNavigate } from "react-router-dom";

export default function TaskForm({ addTask }) {
  const [form, setForm] = useState({ title: "", description: "", completed: false });
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setForm({ ...form, [name]: type === "checkbox" ? checked : value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    addTask(form);
    navigate("/");
  };

  return (
    <form onSubmit={handleSubmit} className="p-3 border rounded shadow-sm bg-light">
      <div className="mb-3">
        <label className="form-label">Título</label>
        <input
          type="text"
          className="form-control"
          name="title"
          value={form.title}
          onChange={handleChange}
          required
        />
      </div>

      <div className="mb-3">
        <label className="form-label">Descripción</label>
        <textarea
          className="form-control"
          name="description"
          value={form.description}
          onChange={handleChange}
          required
        />
      </div>

      <div className="form-check mb-3">
        <input
          type="checkbox"
          className="form-check-input"
          name="completed"
          checked={form.completed}
          onChange={handleChange}
        />
        <label className="form-check-label">¿Completada?</label>
      </div>

      <button type="submit" className="btn btn-primary">Guardar</button>
    </form>
  );
}
