import React from "react";
import { Link } from "react-router-dom";
import TaskItem from "../components/TaskItem";

export default function Home({ tasks, toggleTask }) {
  return (
    <div>
      <h1 className="mb-4">Lista de Tareas</h1>
      {tasks.map((task) => (
        <div key={task.id} className="d-flex align-items-center mb-2">
          <div className="flex-grow-1">
            <Link to={`/task/${task.id}`} className="text-decoration-none">
              <TaskItem task={task} />
            </Link>
          </div>
          <button
            className={`btn ms-2 ${
              task.completed ? "btn-success" : "btn-outline-secondary"
            }`}
            onClick={() => toggleTask(task.id)} 
          >
            {task.completed ? "✔" : "○"}
          </button>
        </div>
      ))}
    </div>
  );
}

