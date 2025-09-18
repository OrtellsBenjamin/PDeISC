import { useEffect, useState } from "react";
import axios from "axios";
import "bootstrap/dist/css/bootstrap.min.css";

function App() {
  const [usuarios, setUsuarios] = useState([]);
  const [form, setForm] = useState({
    nombre: "",
    apellido: "",
    direccion: "",
    telefono: "",
    celular: "",
    fecha_nacimiento: "",
    email: ""
  });
  const [editId, setEditId] = useState(null);
  const [filtro, setFiltro] = useState("");
  const [errores, setErrores] = useState({});

  const cargarUsuarios = () => {
    axios
      .get("http://localhost:3002/usuarios")
      .then((res) => setUsuarios(res.data))
      .catch((err) => console.error("Error al cargar usuarios:", err));
  };

  useEffect(() => {
    cargarUsuarios();
  }, []);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const validarFormulario = () => {
    const errores = {};
    if (!form.nombre.trim()) errores.nombre = "El nombre es obligatorio.";
    if (!form.apellido.trim()) errores.apellido = "El apellido es obligatorio.";
    if (!form.email.trim()) {
      errores.email = "El email es obligatorio.";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) {
      errores.email = "El email no tiene un formato válido.";
    }
    if (form.telefono && !/^\d+$/.test(form.telefono)) {
      errores.telefono = "El teléfono solo puede contener números.";
    }
    if (form.celular && !/^\d+$/.test(form.celular)) {
      errores.celular = "El celular solo puede contener números.";
    }
    if (form.fecha_nacimiento) {
      const hoy = new Date();
      const fechaNac = new Date(form.fecha_nacimiento);
      if (fechaNac > hoy) errores.fecha_nacimiento = "La fecha de nacimiento no puede ser futura.";
    }
    return errores;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const erroresValidacion = validarFormulario();
    if (Object.keys(erroresValidacion).length > 0) {
      setErrores(erroresValidacion);
      return;
    }
    setErrores({});
    if (editId) {
      axios
        .put(`http://localhost:3002/usuarios/${editId}`, form)
        .then(() => {
          setEditId(null);
          resetForm();
          cargarUsuarios();
        })
        .catch((err) => console.error("Error al actualizar:", err));
    } else {
      axios
        .post("http://localhost:3002/usuarios", form)
        .then(() => {
          resetForm();
          cargarUsuarios();
        })
        .catch((err) => console.error("Error al agregar:", err));
    }
  };

  const handleDelete = (id) => {
    axios
      .delete(`http://localhost:3002/usuarios/${id}`)
      .then(() => cargarUsuarios())
      .catch((err) => console.error("Error al eliminar:", err));
  };

  const handleEdit = (usuario) => {
    setEditId(usuario.id);
    setForm({
      nombre: usuario.nombre,
      apellido: usuario.apellido,
      direccion: usuario.direccion,
      telefono: usuario.telefono,
      celular: usuario.celular,
      fecha_nacimiento: usuario.fecha_nacimiento,
      email: usuario.email
    });
  };

  const resetForm = () => {
    setForm({
      nombre: "",
      apellido: "",
      direccion: "",
      telefono: "",
      celular: "",
      fecha_nacimiento: "",
      email: ""
    });
    setErrores({});
  };

  const usuariosFiltrados = usuarios.filter(
    (u) =>
      u.nombre.toLowerCase().includes(filtro.toLowerCase()) ||
      u.email.toLowerCase().includes(filtro.toLowerCase())
  );

  return (
    <div className="container mt-4">
      <h1 className="mb-4">Usuarios</h1>

      <form onSubmit={handleSubmit} className="mb-4">
        <div className="row">
          <div className="col">
            <input
              name="nombre"
              value={form.nombre}
              onChange={handleChange}
              placeholder="Nombre"
              className="form-control"
            />
            {errores.nombre && <small className="text-danger">{errores.nombre}</small>}
          </div>
          <div className="col">
            <input
              name="apellido"
              value={form.apellido}
              onChange={handleChange}
              placeholder="Apellido"
              className="form-control"
            />
            {errores.apellido && <small className="text-danger">{errores.apellido}</small>}
          </div>
          <div className="col">
            <input
              name="direccion"
              value={form.direccion}
              onChange={handleChange}
              placeholder="Dirección"
              className="form-control"
            />
          </div>
        </div>

        <div className="row mt-2">
          <div className="col">
            <input
              name="telefono"
              value={form.telefono}
              onChange={handleChange}
              placeholder="Teléfono"
              className="form-control"
            />
            {errores.telefono && <small className="text-danger">{errores.telefono}</small>}
          </div>
          <div className="col">
            <input
              name="celular"
              value={form.celular}
              onChange={handleChange}
              placeholder="Celular"
              className="form-control"
            />
            {errores.celular && <small className="text-danger">{errores.celular}</small>}
          </div>
          <div className="col">
            <input
              type="date"
              name="fecha_nacimiento"
              value={form.fecha_nacimiento}
              onChange={handleChange}
              className="form-control"
            />
            {errores.fecha_nacimiento && <small className="text-danger">{errores.fecha_nacimiento}</small>}
          </div>
        </div>

        <div className="row mt-2">
          <div className="col">
            <input
              type="email"
              name="email"
              value={form.email}
              onChange={handleChange}
              placeholder="Email"
              className="form-control"
            />
            {errores.email && <small className="text-danger">{errores.email}</small>}
          </div>
          <div className="col">
            <button type="submit" className="btn btn-primary">
              {editId ? "Actualizar" : "Agregar"}
            </button>
          </div>
        </div>
      </form>

      <input
        type="text"
        placeholder="Filtrar por nombre o email"
        className="form-control mb-3"
        value={filtro}
        onChange={(e) => setFiltro(e.target.value)}
      />
      <table className="table table-striped">
        <thead>
          <tr>
            <th>Nombre</th>
            <th>Apellido</th>
            <th>Dirección</th>
            <th>Teléfono</th>
            <th>Celular</th>
            <th>Fecha de Nacimiento</th>
            <th>Email</th>
            <th>Acciones</th>
          </tr>
        </thead>
        <tbody>
          {usuariosFiltrados.map((u) => (
            <tr key={u.id}>
              <td>{u.nombre}</td>
              <td>{u.apellido}</td>
              <td>{u.direccion}</td>
              <td>{u.telefono}</td>
              <td>{u.celular}</td>
              <td>{u.fecha_nacimiento ? new Date(u.fecha_nacimiento).toLocaleDateString() : ""}</td>
              <td>{u.email}</td>
              <td>
                <button
                  className="btn btn-warning btn-sm me-2"
                  onClick={() => handleEdit(u)}
                >
                  Editar
                </button>
                <button
                  className="btn btn-danger btn-sm"
                  onClick={() => handleDelete(u.id)}
                >
                  Borrar
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default App;
