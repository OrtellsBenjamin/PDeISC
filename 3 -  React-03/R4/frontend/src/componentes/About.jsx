export default function About({ aboutRef, aboutText, setAboutText, editingSection, setEditingSection, isLogged }) {
  return (
    <section
      id="about"
      ref={aboutRef}
      className="min-h-screen flex flex-col md:flex-row items-center px-6 py-16 gap-20"
    >
      <div className="max-w-4xl w-full mx-auto flex flex-col md:flex-row items-center gap-8">

        <div className="flex-1 space-y-6 text-gray-800 text-lg leading-relaxed md:mr-auto mt-20">
          <h2 className="text-2xl md:text-3xl font-bold flex items-center gap-2 mb-4">
          Sobre mí
          </h2>

          {editingSection === "about" ? (
            <textarea
              className="w-full border p-2 rounded text-gray-800"
              value={aboutText}
              onChange={(e) => setAboutText(e.target.value)}
              rows={6}
            />
          ) : (
            <p className="text-gray-700">{aboutText}</p>
          )}

          {isLogged && editingSection !== "about" && (
            <button
              onClick={() => setEditingSection("about")}
              className="mt-4 text-sm text-blue-600 underline"
            >
              Editar
            </button>
          )}

          {editingSection === "about" && (
            <button
              onClick={() => setEditingSection(null)}
              className="mt-2 px-4 py-2 bg-green-600 text-white rounded"
            >
              Guardar
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
    </section>
  );
}
