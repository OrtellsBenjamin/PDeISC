import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { supabase } from "../lib/supabaseClient";

export default function Hero({
  heroRef,
  heroTitle,
  setHeroTitle,
  heroText,
  setHeroText,
  editingSection,
  setEditingSection,
  isLogged,
}) {
  const [localTitle, setLocalTitle] = useState("");
  const [localText, setLocalText] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const [isError, setIsError] = useState(false);

  useEffect(() => {
    const fetchHero = async () => {
      try {
        const { data, error } = await supabase
          .from("hero")
          .select("id, heroTitle, heroText")
          .limit(1);

        if (error) throw error;

        if (data.length > 0) {
          const heroData = data[0];
          setLocalTitle(heroData.heroTitle ?? "");
          setLocalText(heroData.heroText ?? "");
          setHeroTitle(heroData.heroTitle ?? "");
          setHeroText(heroData.heroText ?? "");
        } else {
          const { data: newData, error: insertError } = await supabase
            .from("hero")
            .insert([{ heroTitle: "Bienvenido a mi portfolio", heroText: "Soy desarrollador web" }])
            .select()
            .limit(1);

          if (insertError) throw insertError;

          setLocalTitle(newData[0].heroTitle ?? "");
          setLocalText(newData[0].heroText ?? "");
          setHeroTitle(newData[0].heroTitle ?? "");
          setHeroText(newData[0].heroText ?? "");
        }
      } catch (err) {
        console.error("Error cargando hero:", err.message);
      }
    };
    fetchHero();
  }, [setHeroTitle, setHeroText]);

  const handleSaveHero = async () => {
    if (!localTitle.trim() || !localText.trim()) {
      setIsError(true);
      setSuccessMessage("Título y texto no pueden estar vacíos");
      setTimeout(() => setSuccessMessage(""), 3000);
      return;
    }

    if (/\d/.test(localTitle)) {
      setIsError(true);
      setSuccessMessage("El título no puede contener números");
      setTimeout(() => setSuccessMessage(""), 3000);
      return;
    }

    try {
      const { data: existing, error: fetchError } = await supabase
        .from("hero")
        .select("id")
        .limit(1);

      if (fetchError) throw fetchError;

      if (existing.length > 0) {
        const { error: updateError } = await supabase
          .from("hero")
          .update({ heroTitle: localTitle, heroText: localText })
          .eq("id", existing[0].id);

        if (updateError) throw updateError;
      } else {
        const { error: insertError } = await supabase
          .from("hero")
          .insert([{ heroTitle: localTitle, heroText: localText }]);
        if (insertError) throw insertError;
      }

      setHeroTitle(localTitle);
      setHeroText(localText);
      setEditingSection(null);
      setIsError(false);
      setSuccessMessage("Hero guardado correctamente");
      setTimeout(() => setSuccessMessage(""), 4000);
    } catch (err) {
      console.error("Error al guardar Hero:", err.message);
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
          className="w-28 h-28 rounded-full border-4 border-white shadow-md md:w-32 md:h-32 mt-40"
        />

        {editingSection === "hero" && isLogged ? (
          <>
            <input
              value={localTitle}
              onChange={(e) => setLocalTitle(e.target.value)}
              className="border p-2 rounded w-full text-xl font-bold"
            />
            <textarea
              value={localText}
              onChange={(e) => setLocalText(e.target.value)}
              className="border p-2 rounded w-full mt-2"
              rows={5}
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
          <>
            <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-gray-900 mt-0">{localTitle}</h2>
            <p className="text-base md:text-lg lg:text-xl text-gray-700">{localText}</p>
          </>
        )}

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
              isError ? "bg-red-500 text-white border border-red-600" : "bg-green-500 text-white border border-green-600"
            }`}
          >
            {successMessage}
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
}
