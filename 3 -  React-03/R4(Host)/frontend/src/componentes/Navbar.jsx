import { useState } from "react";
import { Menu, X } from "lucide-react";

export default function Navbar({ isLogged, setIsLogged, onLoginClick }) {
  const [isOpen, setIsOpen] = useState(false);

  const navItems = [
    { name: "Sobre mí", href: "#about" },
    { name: "Experiencia laboral", href: "#experience" },
    { name: "Proyectos", href: "#projects" },
  ];

  
  const handleNavClick = (e, href) => {
    e.preventDefault();
    const sectionId = href.replace("#", "");
    const section = document.getElementById(sectionId);
    
    
    if (section) {
      const navbarHeight = 64; 
      const elementPosition = section.getBoundingClientRect().top;
      const offsetPosition = elementPosition + window.pageYOffset - navbarHeight;
      
      window.scrollTo({
        top: offsetPosition,
        behavior: "smooth"
      });
    } else {
      console.error(`No se encontró la sección con id: ${sectionId}`);
    }
    setIsOpen(false);
  };


  const handleAuthClick = () => {
    if (isLogged) {
      setIsLogged(false);
    } else {
      if (onLoginClick) {
        onLoginClick();
      }
    }
    setIsOpen(false);
  };

  return (
    <nav className="bg-white shadow-md fixed w-full z-50 top-0">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-end h-16 items-center">
        
          <div className="hidden md:flex items-center space-x-4">
            {navItems.map((item) => (
              <button
                key={item.name}
                onClick={(e) => handleNavClick(e, item.href)}
                className="text-gray-700 hover:text-blue-600 font-medium transition-colors"
              >
                {item.name}
              </button>
            ))}
            <button
              onClick={handleAuthClick}
              className={`px-4 py-2 rounded text-white font-medium transition-colors ${
                isLogged ? "bg-red-600 hover:bg-red-700" : "bg-blue-600 hover:bg-blue-700"
              }`}
            >
              {isLogged ? "Cerrar sesión" : "Iniciar sesión"}
            </button>
          </div>


          <div className="md:hidden flex items-center gap-2">
            <button
              onClick={handleAuthClick}
              className={`px-3 py-1 rounded text-white text-sm font-medium ${
                isLogged ? "bg-red-600 hover:bg-red-700" : "bg-blue-600 hover:bg-blue-700"
              }`}
            >
              {isLogged ? "Cerrar" : "Login"}
            </button>
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="text-gray-700 hover:text-blue-600 focus:outline-none"
            >
              {isOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>
      </div>

      {isOpen && (
        <div className="md:hidden bg-white shadow-md">
          <div className="px-2 pt-2 pb-3 space-y-1">
            {navItems.map((item) => (
              <button
                key={item.name}
                onClick={(e) => handleNavClick(e, item.href)}
                className="block w-full text-left px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:bg-blue-50 hover:text-blue-600 transition-colors"
              >
                {item.name}
              </button>
            ))}
          </div>
        </div>
      )}
    </nav>
  );
}