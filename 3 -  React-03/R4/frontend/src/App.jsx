import React, { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import LoginModal from "./componentes/LoginModal";
import Navbar from "./componentes/Navbar";
import Hero from "./componentes/Hero";
import About from "./componentes/About";
import Projects from "./componentes/Projects";
import Experience from "./componentes/Experience";
import { Github, Linkedin } from "lucide-react";

export default function App() {
  const [active, setActive] = useState("sobreMi");
  const [isLogged, setIsLogged] = useState(false);
  const [showLogin, setShowLogin] = useState(false);
  const [loginData, setLoginData] = useState({ user: "", pass: "" });
  const [editingSection, setEditingSection] = useState(null);

  const [sobreMiText, setSobreMiText] = useState("");
  const [aboutText, setAboutText] = useState("");
  const [projectsList, setProjectsList] = useState([]);

  const [loginError, setLoginError] = useState(""); 

  const sobreMiRef = useRef(null);
  const aboutRef = useRef(null);
  const projectsRef = useRef(null);
  const experienceRef = useRef(null);

  const sections = {
    sobreMi: sobreMiRef,
    about: aboutRef,
    projects: projectsRef,
    experience: experienceRef,
  };

  const handleScrollTo = (section) => {
    setActive(section);
    sections[section].current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) setActive(entry.target.id);
        });
      },
      { threshold: 0.5 }
    );

    Object.values(sections).forEach((ref) => ref.current && observer.observe(ref.current));
    return () =>
      Object.values(sections).forEach((ref) => ref.current && observer.unobserve(ref.current));
  }, []);

  const handleLogin = (e) => {
    e.preventDefault();
    if (loginData.user === "admin" && loginData.pass === "1234") {
      setIsLogged(true);
      setShowLogin(false);
    } else {
      setLoginError("Credenciales incorrectas"); 
      setTimeout(() => setLoginError(""), 4000); 
    }
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        const heroRes = await fetch("http://localhost:3000/api/hero");
        const heroData = await heroRes.json();
        setSobreMiText(heroData.heroText || "");
      } catch (err) {
        console.error("Error cargando Hero:", err);
      }

      try {
        const aboutRes = await fetch("http://localhost:3000/api/about");
        const aboutData = await aboutRes.json();
        setAboutText(aboutData.aboutText || "");
      } catch (err) {
        console.error("Error cargando About:", err);
      }

      try {
        const projectsRes = await fetch("http://localhost:3000/api/projects");
        const projectsData = await projectsRes.json();
        setProjectsList(projectsData);
      } catch (err) {
        console.error("Error cargando Projects:", err);
      }
    };

    fetchData();
  }, []);

  return (
    <div className="font-sans relative min-h-screen flex flex-col">
      {showLogin && (
        <LoginModal
          loginData={loginData}
          setLoginData={setLoginData}
          handleLogin={handleLogin}
          setShowLogin={setShowLogin}
        />
      )}

      <Navbar
        sections={sections}
        active={active}
        handleScrollTo={handleScrollTo}
        isLogged={isLogged}
        setShowLogin={setShowLogin}
        setIsLogged={setIsLogged}
      />

      <main className="relative flex-1">
        <div className="absolute inset-0 -z-10 h-full w-full bg-white bg-[radial-gradient(#e5e7eb_1px,transparent_1px)] [background-size:16px_16px]" />

        <Hero
          heroRef={sobreMiRef}
          heroText={sobreMiText}
          setHeroText={setSobreMiText}
          editingSection={editingSection}
          setEditingSection={setEditingSection}
          isLogged={isLogged}
        />

        <About
          aboutRef={aboutRef}
          aboutText={aboutText}
          setAboutText={setAboutText}
          editingSection={editingSection}
          setEditingSection={setEditingSection}
          isLogged={isLogged}
        />

        <Experience
          experienceRef={experienceRef}
          editingSection={editingSection}
          setEditingSection={setEditingSection}
          isLogged={isLogged}
        />

        <Projects
          projectsRef={projectsRef}
          projectsList={projectsList}
          setProjectsList={setProjectsList}
          editingSection={editingSection}
          setEditingSection={setEditingSection}
          isLogged={isLogged}
        />
      </main>

      <footer className="bg-gray-900 text-white py-6 mt-12">
        <div className="max-w-4xl mx-auto flex justify-center gap-6">
          <a
            href="https://github.com"
            target="_blank"
            rel="noopener noreferrer"
            className="hover:text-gray-400 transition-colors transform hover:scale-110"
          >
            <Github className="w-6 h-6" />
          </a>
          <a
            href="https://www.linkedin.com"
            target="_blank"
            rel="noopener noreferrer"
            className="hover:text-gray-400 transition-colors transform hover:scale-110"
          >
            <Linkedin className="w-6 h-6" />
          </a>
        </div>
        <p className="text-center text-sm mt-4 text-gray-400">
          &copy; {new Date().getFullYear()} Mi Portfolio
        </p>
      </footer>

  
      <AnimatePresence>
        {loginError && (
          <motion.div
            initial={{ opacity: 0, y: 50, scale: 0.3 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, scale: 0.5, transition: { duration: 0.2 } }}
            className="fixed bottom-6 right-6 px-6 py-3 rounded-lg shadow-xl z-[9999] bg-red-500 text-white font-medium"
          >
            {loginError}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
