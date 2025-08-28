import TaskForm from "../components/TaskForm";

function CreateTask({ addTask }) {
  return (
    <div>
      <h1>Crear Nueva Tarea</h1>
      <TaskForm addTask={addTask} />
    </div>
  );
}

export default CreateTask;
