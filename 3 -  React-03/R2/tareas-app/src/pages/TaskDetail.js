import { useParams, Link } from "react-router-dom";

function TaskDetail({ tasks }) {
  const { id } = useParams();
  const task = tasks.find((t) => t.id === parseInt(id));

  if (!task) return <p>Tarea no encontrada</p>;
 
  return (
    <div>
      <h2>{task.title}</h2>
      <p><strong>Descripción:</strong> {task.description}</p>
      <p><strong>Fecha:</strong> {task.date}</p>
      <p><strong>Estado:</strong> {task.completed ? "Completada ✅" : "Incompleta ❌"}</p>
      <Link to="/">Volver</Link>
    </div>
  );
}

export default TaskDetail;
