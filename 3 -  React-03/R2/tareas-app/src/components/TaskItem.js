
export default function TaskItem({ task }) {
  return (
    <div className="card shadow-sm">
      <div className="card-body">
        <h5 className="card-title">
          {task.title} {task.completed ? "✅" : "❌"}
        </h5>
        <p className="card-text">
          {task.description?.substring(0, 50) || "Sin descripción"}...
        </p>
      </div>
    </div>
  );
}
