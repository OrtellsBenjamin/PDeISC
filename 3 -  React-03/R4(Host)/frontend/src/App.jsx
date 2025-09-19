import { useState, useRef, useEffect } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Github, Linkedin } from "lucide-react";

import Hero from "./componentes/Hero";
import About from "./componentes/About";
import Experience from "./componentes/Experience";
import Projects from "./componentes/Projects";
import Navbar from "./componentes/Navbar";
import LoginModal from "./componentes/LoginModal";
import { supabase } from "./lib/supabaseClient";

export default function App() {
  const heroRef = useRef(null);
  const aboutRef = useRef(null);
  const experienceRef = useRef(null);
  const projectsRef = useRef(null);

  const [heroTitle, setHeroTitle] = useState("");
  const [heroText, setHeroText] = useState("");
  const [aboutText, setAboutText] = useState("");
  const [experienceList, setExperienceList] = useState([]);
  const [projectsList, setProjectsList] = useState([]);

  const [editingSection, setEditingSection] = useState(null);
  const [isLogged, setIsLogged] = useState(false);
  const [showLogin, setShowLogin] = useState(false);
  const [loginData, setLoginData] = useState({ user: "", pass: "" });
  const [activeSection, setActiveSection] = useState("");

  const [loginMessage, setLoginMessage] = useState("");
  const [loginError, setLoginError] = useState(false);

// ...imports
useEffect(() => {
  const fetchData = async () => {
    try {
      // Hero
      const { data: heroData, error: heroError } = await supabase
        .from("hero")
        .select("heroTitle, heroText")
        .single();
      if (heroError) throw heroError;
      setHeroTitle(heroData?.heroTitle || "");
      setHeroText(heroData?.heroText || "");

      // About (cambiar "aboutText" según tu columna)
      const { data: aboutData, error: aboutError } = await supabase
        .from("about")
        .select("aboutText")
        .single();
      if (aboutError) throw aboutError;
      setAboutText(aboutData?.aboutText || "");

      // Experience (sin link)
      const { data: expData, error: expError } = await supabase
        .from("experience")
        .select("*")
        .order("id", { ascending: true });
      if (expError) throw expError;
      setExperienceList(expData || []);

      // Projects
      const { data: projData, error: projError } = await supabase
        .from("projects")
        .select("*");
      if (projError) throw projError;
      setProjectsList(projData || []);
    } catch (err) {
      console.error("Error cargando datos iniciales:", err.message);
    }
  };
  fetchData();
}, []);


  const handleScrollTo = (id) => {
    let ref = null;
    if (id === "hero") ref = heroRef.current;
    if (id === "sobreMi") ref = aboutRef.current;
    if (id === "experience") ref = experienceRef.current;
    if (id === "projects") ref = projectsRef.current;
    if (ref) ref.scrollIntoView({ behavior: "smooth" });
    setActiveSection(id);
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const { data, error } = await supabase
        .from("users")
        .select("*")
        .eq("username", loginData.user)
        .eq("password", loginData.pass)
        .single();

      if (error || !data) {
        setLoginMessage("Credenciales incorrectas");
        setLoginError(true);
        setTimeout(() => setLoginMessage(""), 3000);
        return;
      }

      setIsLogged(true);
      setShowLogin(false);
      setLoginData({ user: "", pass: "" });
      setLoginMessage("Ingreso exitoso");
      setLoginError(false);
      setTimeout(() => setLoginMessage(""), 3000);
    } catch (err) {
      console.error("Error en login:", err.message);
    }
  };

  return (
    <div className="font-sans relative min-h-screen flex flex-col">
      <Navbar
        active={activeSection}
        handleScrollTo={handleScrollTo}
        isLogged={isLogged}
        setShowLogin={setShowLogin}
        setIsLogged={setIsLogged}
      />

      <main className="relative flex-1">
     
        <div className="absolute inset-0 -z-10 h-full w-full bg-white bg-[radial-gradient(#e5e7eb_1px,transparent_1px)] [background-size:16px_16px]"></div>

        <Hero
          heroRef={heroRef}
          heroTitle={heroTitle}
          setHeroTitle={setHeroTitle}
          heroText={heroText}
          setHeroText={setHeroText}
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
          experienceList={experienceList}
          setExperienceList={setExperienceList}
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

      {showLogin && (
        <LoginModal
          loginData={loginData}
          setLoginData={setLoginData}
          handleLogin={handleLogin}
          setShowLogin={setShowLogin}
        />
      )}

      <AnimatePresence>
        {loginMessage && (
          <motion.div
            initial={{ opacity: 0, y: 50, scale: 0.3 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, scale: 0.5, transition: { duration: 0.2 } }}
            className={`fixed bottom-6 right-6 px-6 py-3 rounded-lg shadow-xl z-[9999] font-medium ${
              loginError ? "bg-red-500 text-white border border-red-600" : "bg-green-500 text-white border border-green-600"
            }`}
          >
            {loginMessage}
          </motion.div>
        )}
      </AnimatePresence>

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
    </div>
  );
}
