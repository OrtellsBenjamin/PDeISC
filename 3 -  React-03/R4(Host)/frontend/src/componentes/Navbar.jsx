import { useState } from "react";
import { Menu, X } from "lucide-react";

export default function Navbar({ active, handleScrollTo, isLogged, setShowLogin, setIsLogged }) {
  const [isOpen, setIsOpen] = useState(false);

  const menuItems = [
    { label: "Sobre Mi", id: "sobreMi" },
    { label: "Experiencia", id: "experience" },
    { label: "Proyectos", id: "projects" },
  ];

  return (
    <nav className="fixed top-0 w-full bg-white shadow-md py-4 px-6 flex justify-between items-center z-50">
      <h1 className="text-xl font-bold">Mi Portfolio</h1>


      <div className="hidden md:flex gap-4 items-center">
        {menuItems.map((item) => (
          <button
            key={item.id}
            onClick={() => handleScrollTo(item.id)}
            className={`${
              active === item.id ? "text-blue-600 font-bold" : "text-gray-700"
            }`}
          >
            {item.label}
          </button>
        ))}

        {!isLogged ? (
          <button onClick={() => setShowLogin(true)} className="ml-4 px-3 py-1 border rounded">
            Iniciar sesión
          </button>
        ) : (
          <button onClick={() => setIsLogged(false)} className="ml-4 px-3 py-1 border rounded text-red-700">
            Cerrar sesión
          </button>
        )}
      </div>

   
      <div className="md:hidden flex items-center">
        <button onClick={() => setIsOpen(!isOpen)}>
          {isOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
        </button>
      </div>

    
      {isOpen && (
        <div className="absolute top-full left-0 w-full bg-white shadow-md flex flex-col items-center py-4 gap-2 md:hidden">
          {menuItems.map((item) => (
            <button
              key={item.id}
              onClick={() => {
                handleScrollTo(item.id);
                setIsOpen(false);
              }}
              className={`${active === item.id ? "text-blue-600 font-bold" : "text-gray-700"}`}
            >
              {item.label}
            </button>
          ))}

          {!isLogged ? (
            <button
              onClick={() => {
                setShowLogin(true);
                setIsOpen(false);
              }}
              className="px-4 py-1 border rounded"
            >
              Iniciar sesión
            </button>
          ) : (
            <button
              onClick={() => {
                setIsLogged(false);
                setIsOpen(false);
              }}
              className="px-4 py-1 border rounded text-red-700"
            >
              Cerrar sesión
            </button>
          )}
        </div>
      )}
    </nav>
  );
}
