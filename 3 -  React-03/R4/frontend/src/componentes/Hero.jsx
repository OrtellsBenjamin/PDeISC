import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { supabase } from "../lib/supabaseClient";

export default function Hero({ heroRef, heroText, setHeroText, editingSection, setEditingSection, isLogged }) {
  const [successMessage, setSuccessMessage] = useState("");
  const [isError, setIsError] = useState(false);
  const [localText, setLocalText] = useState("");


 useEffect(() => {
  const fetchHero = async () => {
    try {
      const { data, error } = await supabase
        .from("hero")
        .select("id, heroText, subText, updated_at")
        .single(); // porque solo vas a tener 1 fila

      if (error && error.code !== "PGRST116") throw error;

      setLocalText(data?.heroText || "");
      setHeroText(data?.heroText || "");
    } catch (err) {
      console.error("Error cargando hero:", err);
    }
  };
  fetchHero();
}, [setHeroText]);

const handleSaveHero = async () => {
  if (!localText.trim()) {
    setIsError(true);
    setSuccessMessage("El texto no puede estar vacío");
    setTimeout(() => setSuccessMessage(""), 3000);
    return;
  }

  try {
    const { data, error } = await supabase
      .from("hero")
      .select("id")
      .single();

    if (error && error.code !== "PGRST116") throw error;

    if (data?.id) {
      // ✅ actualizar heroText en lugar de text
      const { error: updateError } = await supabase
        .from("hero")
        .update({ heroText: localText })
        .eq("id", data.id);
      if (updateError) throw updateError;
    } else {
      // ✅ insertar con heroText
      const { error: insertError } = await supabase
        .from("hero")
        .insert({ heroText: localText });
      if (insertError) throw insertError;
    }

    setIsError(false);
    setSuccessMessage("Hero guardado correctamente");
    setHeroText(localText);
    setEditingSection(null);
    setTimeout(() => setSuccessMessage(""), 4000);
  } catch (err) {
    console.error("Error al guardar Hero:", err);
    setIsError(true);
    setSuccessMessage("Error al guardar Hero");
    setTimeout(() => setSuccessMessage(""), 4000);
  }
};

  return (
    <section id="hero" ref={heroRef} className="h-[75vh] flex items-center px-6 py-12">
      <div className="max-w-4xl mx-auto flex flex-col items-start gap-6 md:gap-8 w-full min-h-[250px] justify-center">
        <img
          src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTfKWCwIDhvZ37cbO44lh2drMjplR5pNpqG_Q&s"
          alt="Mi foto"
          className="w-28 h-28 rounded-full border-4 border-white shadow-md md:w-32 md:h-32 mt-50"
        />
        <span className="px-2 py-1 text-sm bg-green-100 text-green-700 rounded-full md:text-base">
          Disponible para trabajar
        </span>
        <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-gray-900 mt-0">
          Hola, soy Rodrigo Paredes
        </h2>

        <div className="w-full text-left">
          {editingSection === "hero" && isLogged ? (
            <>
              <textarea
                value={localText}
                onChange={handleChange}
                className="border p-2 rounded w-full"
              />
              <div className="flex gap-2 mt-2">
                <button
                  onClick={handleSaveHero}
                  className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700 transition-colors"
                >
                  Guardar
                </button>
                <button
                  onClick={() => setEditingSection(null)}
                  className="px-4 py-2 bg-gray-300 text-gray-800 rounded hover:bg-gray-400 transition-colors"
                >
                  Cancelar
                </button>
              </div>
            </>
          ) : (
            <p className="text-base md:text-lg lg:text-xl text-gray-700">{localText}</p>
          )}
        </div>

        {isLogged && editingSection !== "hero" && (
          <button
            onClick={() => setEditingSection("hero")}
            className="mt-4 text-sm text-blue-600 underline"
          >
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
              isError
                ? "bg-red-500 text-white border border-red-600"
                : "bg-green-500 text-white border border-green-600"
            }`}
          >
            {successMessage}
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
}
