import { useState, useEffect } from "react";
import { supabase } from "../lib/supabaseClient"; // tu conexión a Supabase

export default function About({ aboutRef, aboutText, setAboutText, editingSection, setEditingSection, isLogged }) {
  const [localText, setLocalText] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const [isError, setIsError] = useState(false);

  useEffect(() => {
    const fetchAbout = async () => {
      try {
        const { data, error } = await supabase
          .from("about")
          .select("id, aboutText")
          .limit(1);

        if (error) throw error;

        if (data.length > 0) {
          setLocalText(data[0].aboutText ?? "");
          setAboutText(data[0].aboutText ?? "");
        } else {
          const { data: newData, error: insertError } = await supabase
            .from("about")
            .insert([{ aboutText: "Hola, soy desarrollador web y este es mi portfolio." }])
            .select()
            .limit(1);
          if (insertError) throw insertError;

          setLocalText(newData[0].aboutText ?? "");
          setAboutText(newData[0].aboutText ?? "");
        }
      } catch (err) {
        console.error("Error cargando About:", err.message);
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
      const { data, error } = await supabase
        .from("about")
        .update({ aboutText: localText })
        .eq("id", 1)
        .select()
        .single();

      if (error) throw error;

      setAboutText(localText);
      setEditingSection(null);
      setIsError(false);
      setSuccessMessage("About guardado correctamente");
      setTimeout(() => setSuccessMessage(""), 4000);
    } catch (err) {
      console.error("Error guardando About:", err.message);
      setIsError(true);
      setSuccessMessage("Error al guardar About");
      setTimeout(() => setSuccessMessage(""), 4000);
    }
  };

  return (
    <section id="about" ref={aboutRef} className="min-h-screen flex flex-col md:flex-row items-center px-6 py-16 gap-20">
      <div className="max-w-4xl w-full mx-auto flex flex-col md:flex-row items-center gap-8">
        <div className="flex-1 space-y-6 text-gray-800 text-lg leading-relaxed md:mr-auto mt-20">
          <h2 className="text-2xl md:text-3xl font-bold mb-4">Sobre mí</h2>

          {editingSection === "about" && isLogged ? (
            <>
              <textarea
                className="w-full border p-2 rounded text-gray-800"
                value={localText}
                onChange={(e) => setLocalText(e.target.value)}
                rows={6}
              />
              <div className="mt-2 flex gap-2">
                <button
                  onClick={handleSaveAbout}
                  className="px-4 py-2 bg-green-600 text-white rounded"
                >
                  Guardar
                </button>
                <button
                  onClick={() => {
                    setLocalText(aboutText); // restaura el valor original
                    setEditingSection(null);
                  }}
                  className="px-4 py-2 bg-gray-300 text-gray-800 rounded"
                >
                  Cancelar
                </button>
              </div>
            </>
          ) : (
            <p className="text-gray-700">{localText}</p>
          )}

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
            alt="Foto"
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
