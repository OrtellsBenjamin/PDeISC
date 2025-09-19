import { useState, useEffect } from "react";
import { supabase } from "../lib/supabaseClient";

export default function About({ aboutRef, aboutText, setAboutText, editingSection, setEditingSection, isLogged }) {
  const [localText, setLocalText] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const [isError, setIsError] = useState(false);

  // Cargar texto de "About" desde Supabase al montar
  useEffect(() => {
    const fetchAbout = async () => {
      try {
        const { data, error } = await supabase.from("about").select("text").single();
        if (error && error.code !== "PGRST116") throw error; // PGRST116 = no hay filas
        setLocalText(data?.text || "");
        setAboutText(data?.text || "");
      } catch (err) {
        console.error("Error cargando About:", err);
      }
    };
    fetchAbout();
  }, [setAboutText]);

  const handleSaveAbout = async () => {
    if (!localText.trim()) {
      setIsError(true);
      setSuccessMessage("El texto no puede estar vacío");
      setTimeout(() => setSuccessMessage(""), 3000);
      return;
    }

    try {
      const { data, error } = await supabase.from("about").select("id").single();
      if (error && error.code !== "PGRST116") throw error;

      if (data?.id) {
        const { error: updateError } = await supabase.from("about").update({ text: localText }).eq("id", data.id);
        if (updateError) throw updateError;
      } else {
        const { error: insertError } = await supabase.from("about").insert({ text: localText });
        if (insertError) throw insertError;
      }

      setAboutText(localText);
      setEditingSection(null);
      setIsError(false);
      setSuccessMessage("About guardado correctamente");
      setTimeout(() => setSuccessMessage(""), 4000);
    } catch (err) {
      console.error("Error guardando About:", err);
      setIsError(true);
      setSuccessMessage("Error al guardar About");
      setTimeout(() => setSuccessMessage(""), 4000);
    }
  };

  return (
    <section id="about" ref={aboutRef} className="min-h-screen flex flex-col md:flex-row items-center px-6 py-16 gap-20">
      <div className="max-w-4xl w-full mx-auto flex flex-col md:flex-row items-center gap-8">
        <div className="flex-1 space-y-6 text-gray-800 text-lg leading-relaxed md:mr-auto mt-20">
          <h2 className="text-2xl md:text-3xl font-bold flex items-center gap-2 mb-4">Sobre mí</h2>

          {editingSection === "about" ? (
            <textarea
              className="w-full border p-2 rounded text-gray-800"
              value={localText}
              onChange={(e) => setLocalText(e.target.value)}
              rows={6}
            />
          ) : (
            <p className="text-gray-700">{localText}</p>
          )}

          {editingSection === "about" && isLogged ? (
            <button
              onClick={handleSaveAbout}
              className="mt-2 px-4 py-2 bg-green-600 text-white rounded"
            >
              Guardar
            </button>
          ) : null}

          {isLogged && editingSection !== "about" && (
            <button
              onClick={() => setEditingSection("about")}
              className="mt-4 text-sm text-blue-600 underline"
            >
              Editar
            </button>
          )}
        </div>

        <div className="flex-1 flex justify-center md:justify-end">
          <img
            src="https://content.elmueble.com/medio/2024/06/04/golden-retriever_c97b1fdd_240604125307_900x900.jpg"
            alt="Foto de Miguel Ángel"
            className="w-64 md:w-72 rounded-lg shadow-lg rotate-3 border border-gray-300"
          />
        </div>
      </div>

      {successMessage && (
        <div
          className={`fixed bottom-6 right-6 px-6 py-3 rounded-lg shadow-xl z-[9999] font-medium ${
            isError ? "bg-red-500 text-white" : "bg-green-500 text-white"
          }`}
        >
          {successMessage}
        </div>
      )}
    </section>
  );
}
