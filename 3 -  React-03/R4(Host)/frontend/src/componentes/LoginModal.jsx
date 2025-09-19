import { motion, AnimatePresence } from "framer-motion";

export default function LoginModal({ loginData, setLoginData, handleLogin, setShowLogin }) {

  const handleUserChange = (e) => {
    const value = e.target.value.replace(/\s+/g, ""); 
    if (/^[A-Za-z]*$/.test(value)) {
      setLoginData({ ...loginData, user: value });
    }
  };

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 flex items-center justify-center z-50"
      >
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="absolute inset-0 bg-black/40 backdrop-blur-sm"
          onClick={() => setShowLogin(false)}
        />
        <motion.div
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.8, opacity: 0 }}
          transition={{ duration: 0.3, ease: "easeOut" }}
          className="relative z-10 w-full max-w-sm p-6 bg-white rounded-2xl shadow-lg"
        >
          <h2 className="text-2xl font-bold mb-4 text-center">Iniciar Sesión</h2>
          <form onSubmit={handleLogin} className="flex flex-col gap-4">
            <input
              type="text"
              placeholder="Usuario"
              value={loginData.user}
              onChange={handleUserChange}
              className="focus:outline-none border-b-2 border-blue-700 focus:border-blue-500"
            />
            <input
              type="password"
              placeholder="Contraseña"
              value={loginData.pass}
              onChange={(e) => setLoginData({ ...loginData, pass: e.target.value })}
              className="focus:outline-none border-b-2 border-blue-700 focus:border-blue-500"
            />
            <button type="submit" className="bg-blue-500 hover:bg-blue-600 text-white py-2 rounded-lg">
              Entrar
            </button>
          </form>
          <button
            onClick={() => setShowLogin(false)}
            className="mt-4 text-sm text-gray-500 hover:underline block mx-auto"
          >
            Cancelar
          </button>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}
