import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Briefcase } from "lucide-react";
import { supabase } from "../lib/supabaseClient";

export default function Experience({ experienceRef, editingSection, setEditingSection, isLogged }) {
  const [experienceList, setExperienceList] = useState([]);
  const [successMessage, setSuccessMessage] = useState("");
  const [isError, setIsError] = useState(false);
  const [confirmDelete, setConfirmDelete] = useState(null); // ✅ Inicialización correcta

  // Cargar experiencias
  useEffect(() => {
    const fetchExperience = async () => {
      try {
        const { data, error } = await supabase
          .from("experience")
          .select("id, role, company, date, description, link")
          .order("date", { ascending: false });
        if (error && error.code !== "PGRST116") throw error;

        setExperienceList((data || []).map((exp) => ({ ...exp, link: exp.link || "" })));
      } catch (err) {
        console.error("Error cargando experiencias:", err);
      }
    };
    fetchExperience();
  }, []);

  const handleChange = (i, field, value) => {
    const newList = [...experienceList];
    if (field === "role" || field === "company") {
      value = value.replace(/[^a-zA-ZáéíóúüÁÉÍÓÚÜñÑ\s-]/g, "");
    }
    newList[i][field] = value;
    setExperienceList(newList);
  };

  const handleAddExperience = () => {
    const newExp = { role: "", company: "", date: "", description: "", link: "" };
    setExperienceList((prev) => [...prev, newExp]);
  };

  const handleDeleteExperience = async (index) => {
    const expToDelete = experienceList[index];
    if (!expToDelete) return;

    if (expToDelete.id) {
      try {
        const { error } = await supabase.from("experience").delete().eq("id", expToDelete.id);
        if (error) throw error;
      } catch (err) {
        console.error(err);
        setIsError(true);
        setSuccessMessage("Error al eliminar experiencia");
        setTimeout(() => setSuccessMessage(""), 4000);
        return;
      }
    }

    const newList = [...experienceList];
    newList.splice(index, 1);
    setExperienceList(newList);
    setSuccessMessage("Experiencia eliminada correctamente");
    setTimeout(() => setSuccessMessage(""), 4000);
  };

  const handleSaveExperience = async () => {
    for (const exp of experienceList) {
      if (!exp.role.trim() || !exp.company.trim() || !exp.date.trim()) {
        setIsError(true);
        setSuccessMessage("Role, Company y Date son obligatorios");
        setTimeout(() => setSuccessMessage(""), 4000);
        return;
      }
    }

    try {
      const promises = experienceList.map(async (exp) => {
        if (exp.id) {
          const { error } = await supabase.from("experience").update(exp).eq("id", exp.id);
          if (error) throw error;
        } else {
          const { data, error } = await supabase.from("experience").insert(exp).select("id");
          if (error) throw error;
          exp.id = data[0].id;
        }
      });

      await Promise.all(promises);

      setExperienceList([...experienceList]);
      setEditingSection(null);
      setSuccessMessage("Experiencias guardadas correctamente");
      setIsError(false);
      setTimeout(() => setSuccessMessage(""), 4000);
    } catch (err) {
      console.error(err);
      setIsError(true);
      setSuccessMessage("Error al guardar experiencias");
      setTimeout(() => setSuccessMessage(""), 4000);
    }
  };

  return (
    <section id="experience" ref={experienceRef} className="h-auto py-16 px-6">
      <div className="max-w-4xl mx-auto">
        <h2 className="text-3xl font-bold mb-12 flex items-center gap-2">
          <Briefcase className="w-6 h-6" /> Experiencia laboral
        </h2>

        <div className="relative border-l-2 border-gray-300 pl-8 md:pl-12">
          {experienceList.map((exp, i) => (
            <motion.div
              key={exp.id || i}
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5 }}
              className="mb-10 relative"
            >
              <span className="absolute -left-5 top-2 w-4 h-4 bg-blue-600 rounded-full border-2 border-white"></span>
              <div className="flex flex-col md:flex-row md:gap-6">
                <div className="md:w-1/3">
                  {editingSection === "experience" ? (
                    <>
                      <input value={exp.role} onChange={(e) => handleChange(i, "role", e.target.value)} placeholder="Cargo" className="border p-1 w-full mb-1 rounded" />
                      <input value={exp.company} onChange={(e) => handleChange(i, "company", e.target.value)} placeholder="Empresa" className="border p-1 w-full mb-1 rounded" />
                      <input value={exp.date} onChange={(e) => handleChange(i, "date", e.target.value)} placeholder="Fecha" className="border p-1 w-full mb-1 rounded" />
                    </>
                  ) : (
                    <>
                      <h3 className="text-blue-600 font-bold text-lg">{exp.role}</h3>
                      <p className="text-gray-800 font-medium">{exp.company}</p>
                      <p className="text-gray-400 text-sm">{exp.date}</p>
                    </>
                  )}
                </div>

                <div className="md:flex-1 mt-2 md:mt-0">
                  {editingSection === "experience" ? (
                    <textarea value={exp.description} onChange={(e) => handleChange(i, "description", e.target.value)} placeholder="Descripción" className="border p-2 w-full rounded" />
                  ) : (
                    <p className="text-gray-700">{exp.description}</p>
                  )}
                  {exp.link && !editingSection && <a href={exp.link} className="text-blue-600 font-medium mt-1 inline-block">Saber más &gt;</a>}
                  {editingSection && (
                    <button onClick={() => setConfirmDelete(i)} className="mt-2 px-4 py-1 bg-red-500 text-white rounded hover:bg-red-600">Eliminar</button>
                  )}
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        {editingSection === "experience" && isLogged && (
          <div className="flex gap-2 mt-4">
            <button onClick={handleAddExperience} className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700">+ Agregar experiencia</button>
            <button onClick={handleSaveExperience} className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700">Guardar</button>
            <button onClick={() => setEditingSection(null)} className="px-4 py-2 bg-gray-300 text-gray-800 rounded hover:bg-gray-400">Cancelar</button>
          </div>
        )}

        {isLogged && editingSection !== "experience" && (
          <button onClick={() => setEditingSection("experience")} className="mt-4 text-sm text-blue-600 underline">Editar</button>
        )}
      </div>

      <AnimatePresence>
        {successMessage && (
          <motion.div
            initial={{ opacity: 0, y: 50, scale: 0.3 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, scale: 0.5, transition: { duration: 0.2 } }}
            className={`fixed bottom-6 right-6 px-6 py-3 rounded-lg shadow-xl z-[9999] font-medium ${isError ? "bg-red-500 text-white" : "bg-green-500 text-white"}`}
          >
            {successMessage}
          </motion.div>
        )}

        {confirmDelete !== null && (
          <motion.div
            initial={{ opacity: 0, y: 50, scale: 0.3 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, scale: 0.5, transition: { duration: 0.2 } }}
            className="fixed bottom-6 right-6 px-6 py-4 rounded-lg shadow-xl z-[9999] bg-yellow-400 text-black font-medium flex flex-col gap-2"
          >
            <span>¿Seguro que quiere eliminar esta experiencia?</span>
            <div className="flex gap-2 justify-end">
              <button onClick={() => { handleDeleteExperience(confirmDelete); setConfirmDelete(null); }} className="px-3 py-1 bg-red-600 text-white rounded hover:bg-red-700">Sí</button>
              <button onClick={() => setConfirmDelete(null)} className="px-3 py-1 bg-gray-700 text-white rounded hover:bg-gray-800">No</button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
}
