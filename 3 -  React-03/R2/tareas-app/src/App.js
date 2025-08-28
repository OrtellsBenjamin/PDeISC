import { Routes, Route, Link } from "react-router-dom";
import Home from "./pages/Home";
import TaskDetail from "./pages/TaskDetail";
import CreateTask from "./pages/CreateTask";
import { useState } from "react";
import tasksData from "./data/tasksData";

function App() {
  const [tasks, setTasks] = useState(tasksData);

  const addTask = (newTask) => {
    setTasks([
      ...tasks,
      { ...newTask, id: tasks.length + 1, date: new Date().toLocaleDateString() }
    ]);
  };

  const toggleTask = (id) => {
    setTasks(
      tasks.map((task) =>
        task.id === id ? { ...task, completed: !task.completed } : task
      )
    );
  };

  return (
    <div>
      <nav className="navbar navbar-expand-lg navbar-dark bg-dark mb-4">
        <div className="container">
          <Link className="navbar-brand" to="/">
            TareasApp
          </Link>
          <div>
            <Link className="btn btn-outline-light me-2" to="/">
              Inicio
            </Link>
            <Link className="btn btn-success" to="/create">
              Nueva Tarea
            </Link>
          </div>
        </div>
      </nav>

      <div className="container">
        <Routes>
          <Route path="/" element={<Home tasks={tasks} toggleTask={toggleTask} />} />
          <Route path="/task/:id" element={<TaskDetail tasks={tasks} />} />
          <Route path="/create" element={<CreateTask addTask={addTask} />} />
        </Routes>
      </div>
    </div>
  );
}

export default App;
