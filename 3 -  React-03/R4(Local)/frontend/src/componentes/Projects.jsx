import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";

export default function Projects({
  projectsRef,
  projectsList,
  setProjectsList,
  editingSection,
  setEditingSection,
  isLogged,
}) {
  const [successMessage, setSuccessMessage] = useState("");
  const [isError, setIsError] = useState(false);
  const [confirmDelete, setConfirmDelete] = useState(null);

  // Cargar proyectos desde backend local
  useEffect(() => {
    const fetchProjects = async () => {
      try {
        const res = await fetch("http://localhost:3000/api/projects");
        const data = await res.json();
        const safeData = (data || []).map((proj) => ({
          id: proj.id,
          title: proj.title || "",
          description: proj.description || "",
          image: proj.image || "",
          tech: proj.tech || [],
          link_code: proj.link_code || "#",
        }));
        setProjectsList(safeData);
      } catch (err) {
        console.error("Error cargando proyectos:", err);
      }
    };

    fetchProjects();
  }, [setProjectsList]);

  // Guardar todos los proyectos
  const handleSaveProjects = async () => {
    for (const proj of projectsList) {
      if (!proj.title.trim() || !proj.description.trim() || !proj.image.trim() || !proj.link_code.trim()) {
        setIsError(true);
        setSuccessMessage("Todos los campos deben estar completos antes de guardar");
        setTimeout(() => setSuccessMessage(""), 4000);
        return;
      }
    }

    try {
      const promises = projectsList.map(async (proj) => {
        if (proj.id) {
          await fetch(`http://localhost:3000/api/projects`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(proj),
          });
        } else {
          const res = await fetch("http://localhost:3000/api/projects", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(proj),
          });
          const data = await res.json();
          proj.id = data.projects[0].id; // ajustado a tu server.js
        }
      });

      await Promise.all(promises);
      setProjectsList([...projectsList]);
      setIsError(false);
      setSuccessMessage("¡Proyectos guardados correctamente!");
      setEditingSection(null);
      setTimeout(() => setSuccessMessage(""), 4000);
    } catch (err) {
      console.error(err);
      setIsError(true);
      setSuccessMessage("Error al guardar los proyectos");
      setTimeout(() => setSuccessMessage(""), 4000);
    }
  };

  // Agregar un nuevo proyecto
  const handleAddProject = () => {
    const newProj = { title: "", description: "", image: "", tech: [], link_code: "#" };
    setProjectsList((prev) => [...prev, newProj]);
  };

  // Eliminar proyecto
  const handleDeleteProject = async (index) => {
    const projToDelete = projectsList[index];
    if (!projToDelete) return;

    try {
      if (projToDelete.id) {
        await fetch(`http://localhost:3000/api/projects/${projToDelete.id}`, { method: "DELETE" });
      }
      const newList = [...projectsList];
      newList.splice(index, 1);
      setProjectsList(newList);
      setSuccessMessage("Proyecto eliminado correctamente");
      setIsError(false);
      setTimeout(() => setSuccessMessage(""), 4000);
    } catch (err) {
      console.error(err);
      setIsError(true);
      setSuccessMessage("Error al eliminar proyecto");
      setTimeout(() => setSuccessMessage(""), 4000);
    }
  };

  return (
    <section id="projects" ref={projectsRef} className="flex flex-col items-center px-6 pt-8 pb-12">
      <div className="max-w-4xl w-full flex flex-col gap-8">
        <h2 className="text-3xl font-bold text-center mb-4">Proyectos</h2>

        {editingSection === "projects" ? (
          <div className="space-y-4">
            {projectsList.map((proj, i) => (
              <div key={proj.id || i} className="flex flex-col gap-2 border p-2 rounded">
                <input
                  value={proj.title}
                  onChange={(e) => {
                    const newList = [...projectsList];
                    newList[i].title = e.target.value;
                    setProjectsList(newList);
                  }}
                  className="border p-1 rounded"
                  placeholder="Título del proyecto"
                />
                <textarea
                  value={proj.description}
                  onChange={(e) => {
                    const newList = [...projectsList];
                    newList[i].description = e.target.value;
                    setProjectsList(newList);
                  }}
                  className="border p-1 rounded"
                  placeholder="Descripción del proyecto"
                />
                <input
                  value={proj.image}
                  onChange={(e) => {
                    const newList = [...projectsList];
                    newList[i].image = e.target.value;
                    setProjectsList(newList);
                  }}
                  className="border p-1 rounded"
                  placeholder="URL de la imagen"
                />
                <input
                  value={proj.link_code}
                  onChange={(e) => {
                    const newList = [...projectsList];
                    newList[i].link_code = e.target.value;
                    setProjectsList(newList);
                  }}
                  className="border p-1 rounded"
                  placeholder="Link de GitHub"
                />
                <button
                  onClick={() => setConfirmDelete(i)}
                  className="mt-2 px-4 py-1 bg-red-500 text-white rounded hover:bg-red-600"
                >
                  Eliminar
                </button>
              </div>
            ))}

            <div className="flex gap-2">
              <button onClick={handleAddProject} className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700">
                + Agregar proyecto
              </button>
              <button onClick={handleSaveProjects} className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700">
                Guardar
              </button>
            </div>
          </div>
        ) : (
          <div className="flex flex-col gap-8">
            {projectsList.map((proj) => (
              <motion.div key={proj.id} className="flex flex-col md:flex-row gap-6">
                <motion.img
                  whileHover={{ scale: 1.04 }}
                  src={proj.image}
                  alt={proj.title}
                  className="w-full md:w-1/2 rounded-lg shadow-md h-64 object-cover"
                />
                <div className="flex-1 flex flex-col justify-between">
                  <div>
                    <h3 className="text-2xl font-bold mb-2">{proj.title}</h3>
                    <p className="text-gray-700 mb-4">{proj.description}</p>
                  </div>
                  <div className="flex gap-4">
                    <a
                      href={proj.link_code || "#"}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-2 px-4 py-2 border rounded-lg hover:bg-gray-100 transition-colors"
                    >
                      Code
                    </a>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        )}

        {isLogged && editingSection !== "projects" && (
          <button onClick={() => setEditingSection("projects")} className="mt-6 text-sm text-blue-600 underline">
            Editar
          </button>
        )}
      </div>

      <AnimatePresence>
        {successMessage && (
          <motion.div
            initial={{ opacity: 0, y: 50, scale: 0.3 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, scale: 0.5, transition: { duration: 0.2 } }}
            className={`fixed bottom-6 right-6 px-6 py-3 rounded-lg shadow-xl z-[9999] font-medium ${
              isError ? "bg-red-500 text-white border border-red-600" : "bg-green-500 text-white border border-green-600"
            }`}
          >
            {successMessage}
          </motion.div>
        )}

        {confirmDelete !== null && (
          <motion.div
            initial={{ opacity: 0, y: 50, scale: 0.3 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, scale: 0.5, transition: { duration: 0.2 } }}
            className="fixed bottom-6 right-6 px-6 py-4 rounded-lg shadow-xl z-[9999] bg-blue-600 text-white font-medium flex flex-col gap-2"
          >
            <span>¿Seguro que quiere eliminar este proyecto?</span>
            <div className="flex gap-2 justify-end">
              <button
                onClick={() => {
                  handleDeleteProject(confirmDelete);
                  setConfirmDelete(null);
                }}
                className="px-3 py-1 bg-red-600 text-white rounded hover:bg-red-700"
              >
                Sí
              </button>
              <button onClick={() => setConfirmDelete(null)} className="px-3 py-1 bg-gray-700 text-white rounded hover:bg-gray-800">
                No
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
}
