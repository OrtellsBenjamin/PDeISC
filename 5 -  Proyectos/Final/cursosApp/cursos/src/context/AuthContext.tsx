import React, {
  createContext,
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import { supabase } from "../lib/SupaBase";
import { Platform, Linking } from "react-native";
import * as WebBrowser from "expo-web-browser";
import * as AuthSession from "expo-auth-session";

WebBrowser.maybeCompleteAuthSession();

// Mis tipos de usuario
type Role = "client" | "instructor" | "admin" | "pending_instructor"; 
type Profile = { id: string; full_name: string | null; role: Role };

//Contexto de autenticación
type Ctx = {
  session: any;
  profile: Profile | null;
  signInEmail: (email: string, password: string) => Promise<void>;
  signUpEmail: (
    email: string,
    password: string,
    fullName?: string,
    role?: Role 
  ) => Promise<void>;
  signOut: () => Promise<void>;
  signInWithGoogle: () => Promise<void>;
  loading: boolean;
};

export const AuthContext = createContext<Ctx>({} as any);


const DEBUG = true;
const TAG = "AUTH";


//Guardo en almacenamieto local
const safeLocalStorage = {
  keys(): string[] {
    try {
      const keys: string[] = [];
      for (let i = 0; i < localStorage.length; i++) {
        const k = localStorage.key(i);
        if (k) keys.push(k);
      }
      return keys;
    } catch {
      return [];
    }
  },
  remove(key: string) {
    try {
      localStorage.removeItem(key);
    } catch {}
  },

  //Limpio el almacenamiento de keys de supabase
  clearSupabaseKeys() {
    const keys = safeLocalStorage.keys().filter((k) =>
      k.toLowerCase().includes("supabase")
    );
    keys.forEach((k) => safeLocalStorage.remove(k));
    return keys;
  },
};

// Función para imprimir las claves de almacenamiento, para depuración
function snapshotStorage(where: string) {
  if (!DEBUG) return;
  const keys = safeLocalStorage
    .keys()
    .filter((k) => k.toLowerCase().includes("supabase"));
  console.log(`[${TAG}] 📦 Storage @${where}:`, keys);
}


export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [session, setSession] = useState<any>(null);
  const [profile, setProfile] = useState<Profile | null>(null);
  const [loading, setLoading] = useState(true);

  const initComplete = useRef(false);
  const loadingProfileUserId = useRef<string | null>(null);
  const isSigningOut = useRef(false);
  //Una vez que cargue el perfil, lo toma del cache
  const profileCache = useRef<Map<string, Profile>>(new Map());


  //Busca en la base de datos el perfil del usuario o lo crea si no existe
  const fetchOrCreateProfile = useCallback(async (userId: string): Promise<Profile | null> => {
  // Antes de ir a la base, revisa si ya tenemos el perfil guardado en memoria (cache)
  if (profileCache.current.has(userId)) {
    const cached = profileCache.current.get(userId)!;
    console.log(`[${TAG}] Perfil en cache:`, cached);
    setProfile(cached);
    return cached;
  }

  // Si ya se está cargando el mismo perfil en paralelo se espera
  if (loadingProfileUserId.current === userId) {
    await new Promise(resolve => setTimeout(resolve, 500));
    if (profileCache.current.has(userId)) {
      const cached = profileCache.current.get(userId)!;
      setProfile(cached);
      return cached;
    }
    return null;
  }

  // Marca que este perfil se está cargando actualmente
  loadingProfileUserId.current = userId;

  try {
    // Límite de tiempo
    const timeoutPromise = new Promise<null>((_, reject) =>
      setTimeout(() => reject(new Error("Timeout al cargar perfil")), 10000)
    );

    // Promesa principal, intenta buscar o crear el perfil
    const fetchPromise = (async () => {
      console.log(`[${TAG}] Ejecutando query SELECT profiles...`);

      // Busca el perfil del usuario en mi tabla
      const { data, error } = await supabase
        .from("profiles")
        .select("id, full_name, role")
        .eq("id", userId)
        .maybeSingle();

      console.log(`[${TAG}] Respuesta de SELECT:`, {
        hasData: !!data,
        hasError: !!error,
        errorMsg: error?.message,
        errorCode: error?.code,
      });

      if (error) {
        throw error;
      }

      // Si encontró el perfil, lo guarda en memoria y en el estado
      if (data) {
        const prof = data as Profile;
        profileCache.current.set(userId, prof);
        setProfile(prof);
        return prof;
      }

      // Si no existe, crea un perfil nuevo por defecto
      const newProfile = {
        id: userId,
        full_name: "Usuario",
        role: "client" as Role,
      };

      console.log(`[${TAG}] Creando nuevo perfil:`, newProfile);
      console.log(`[${TAG}] Ejecutando query INSERT profiles...`);

      // Inserta el nuevo perfil en la base
      const { data: inserted, error: insErr } = await supabase
        .from("profiles")
        .insert([newProfile])
        .select("id, full_name, role")
        .single();

      console.log(`[${TAG}] Respuesta de INSERT:`, {
        hasData: !!inserted,
        hasError: !!insErr,
        errorMsg: insErr?.message,
      });

      if (insErr) {
        console.error(`[${TAG}] Error al crear perfil:`, insErr);
        throw insErr;
      }

      console.log(`[${TAG}] Perfil creado:`, inserted);
      const prof = inserted as Profile;
      profileCache.current.set(userId, prof);
      setProfile(prof);
      return prof;
    })();

    // Promise.race ejecuta la consulta y el timeout a la vez
    // Limites de tiempo
    const result = await Promise.race([fetchPromise, timeoutPromise]);
    return result;
  } catch (e: any) {
    // Captura cualquier error o excepción que ocurra
    console.error(`[${TAG}] Excepción en fetchOrCreateProfile:`, {
      message: e?.message,
      code: e?.code,
      details: e?.details,
      hint: e?.hint,
      stack: e?.stack?.split("\n")[0],
    });

    setProfile(null);
    return null;
  } finally {
    // Limpia el indicador de carga cuando termina
    console.log(`[${TAG}] fetchOrCreateProfile finalizado para:`, userId);
    loadingProfileUserId.current = null;
  }
}, []);

 useEffect(() => {
  // Esta función se ejecuta cada vez que la app recibe un enlace 
  const handleDeepLink = async (event: { url: string }) => {
    console.log(`[${TAG}] Deep link recibido:`, event.url);

    // Convierte el texto del enlace en un objeto URL para poder acceder a sus parámetros
    const url = new URL(event.url);

    // Obtiene los tokens de la parte de parámetros del enlace 
    const access_token = url.searchParams.get("access_token");
    const refresh_token = url.searchParams.get("refresh_token");

    //En caso de que los tokens estén en el hash
 
    const hashParams = new URLSearchParams(url.hash.substring(1));
    const hashAccessToken = hashParams.get("access_token");
    const hashRefreshToken = hashParams.get("refresh_token");

    // Usa los valores disponibles
    const finalAccessToken = access_token || hashAccessToken;
    const finalRefreshToken = refresh_token || hashRefreshToken;

    // Si hay un token de acceso, establece la sesión en Supabase
    if (finalAccessToken) {
      console.log(`[${TAG}] Tokens OAuth recibidos, estableciendo sesión...`);

      try {
        // Crea o actualiza la sesión de Supabase directamente usando los tokens
        const { data, error } = await supabase.auth.setSession({
          access_token: finalAccessToken,
          refresh_token: finalRefreshToken || "",
        });

        // error que se registra en consola
        if (error) {
          console.error(`[${TAG}] Error al establecer sesión:`, error);
          return;
        }

        console.log(`[${TAG}] Sesión OAuth establecida exitosamente`);
      } catch (err) {
        console.error(`[${TAG}] Error procesando deep link:`, err);
      }
    }
  };

  // Al iniciar la app, revisa si fue abierta con un deep link
  Linking.getInitialURL().then((url) => {
    if (url) {
      console.log(`[${TAG}] Deep link inicial:`, url);
      handleDeepLink({ url });
    }
  });

  // Escucha eventos de apertura de enlaces mientras la app está corriendo
  const subscription = Linking.addEventListener("url", handleDeepLink);

  //Elimina el listener cuando el componente se desmonta
  return () => {
    subscription.remove();
  };
}, []);


// Inicialización del contexto de autenticación y manejo de cambios en la sesión
useEffect(() => {
  let mounted = true; // Evita actualizaciones si el componente se desmonta

  const initialize = async () => {
    console.log(`[${TAG}] Inicializando AuthContext...`);
    snapshotStorage("init:start");

    try {
      // Espera breve
      await new Promise((resolve) => setTimeout(resolve, 100));

      // Recupera la sesión actual guardada por Supabase (si el usuario sigue logueado)
      const {
        data: { session: currentSession },
        error,
      } = await supabase.auth.getSession();

      if (error) console.error(`[${TAG}] Error al obtener sesión:`, error);
      if (!mounted) return;

      if (currentSession) {
        console.log(`[${TAG}] Sesión encontrada:`, currentSession.user.email);

        setSession(currentSession);

        // Intenta cargar o crear el perfil asociado a este usuario
        try {
          await fetchOrCreateProfile(currentSession.user.id);
        } catch (err) {
          console.error(`[${TAG}] Error cargando perfil en init:`, err);
          setProfile(null);
        }
      } else {
        // Si no hay sesión activa
        console.log(`[${TAG}] No hay sesión en init`);
        setSession(null);
        setProfile(null);
      }
    } catch (err) {
      console.error(`[${TAG}] Error en la inicialización:`, err);
      if (mounted) {
        setSession(null);
        setProfile(null);
      }
    } finally {
      // Marca el fin del proceso de inicialización
      if (mounted) {
        initComplete.current = true;
        setLoading(false);
        snapshotStorage("init:end");
        console.log(`[${TAG}] Inicialización completada`);
      }
    }
  };

  // Ejecuta la inicialización al montar el componente
  initialize();

  console.log(`[${TAG}] Registrando listener de cambios de sesión...`);

  // Listener: detecta eventos de autenticación en tiempo real
  const {
    data: { subscription },
  } = supabase.auth.onAuthStateChange(async (event, currentSession) => {
    if (!mounted) return;

    console.log(`[${TAG}] Evento de autenticación: ${event}`, currentSession?.user?.email);
    snapshotStorage(`event:${event}`);

    // Evita conflictos si el usuario está cerrando sesión
    if (isSigningOut.current) return;

    switch (event) {
      case "SIGNED_OUT":
        console.log(`[${TAG}] Usuario deslogueado`);
        setSession(null);
        setProfile(null);
        profileCache.current.clear();
        safeLocalStorage.clearSupabaseKeys();
        if (initComplete.current) setLoading(false);
        break;

      case "INITIAL_SESSION":
        if (!currentSession) {
          console.log(`[${TAG}] No hay sesión inicial`);
          if (initComplete.current) {
            setSession(null);
            setProfile(null);
            setLoading(false);
          }
          break;
        }

        if (initComplete.current) break;

        console.log(`[${TAG}] Procesando sesión inicial`);
        setSession(currentSession);
        try {
          await fetchOrCreateProfile(currentSession.user.id);
        } catch (err) {
          console.error(`[${TAG}] Error cargando perfil en INITIAL_SESSION:`, err);
        } finally {
          if (initComplete.current) setLoading(false);
        }
        break;

        //Caso de inicio de sesión, carga el perfil
      case "SIGNED_IN":
        if (currentSession) {
          console.log(`[${TAG}] Usuario logueado:`, currentSession.user.email);
          setSession(currentSession);
          try {
            await fetchOrCreateProfile(currentSession.user.id);
          } catch (err) {
            console.error(`[${TAG}] Error cargando perfil en SIGNED_IN:`, err);
          } finally {
            setLoading(false);
          }
        }
        break;

      case "TOKEN_REFRESHED":
        if (currentSession) {
          console.log(`[${TAG}] Token refrescado`);
          setSession(currentSession);
        }
        break;

      case "USER_UPDATED":
        if (currentSession) {
          console.log(`[${TAG}] Usuario actualizado`);
          setSession(currentSession);
          profileCache.current.delete(currentSession.user.id);
          await fetchOrCreateProfile(currentSession.user.id);
        }
        break;

      default:
        console.log(`[${TAG}] Evento no manejado:`, event);
        break;
    }
  });

  //Se desactiva  el listener 
  return () => {
    mounted = false;
    console.log(`[${TAG}] Desregistrando listener`);
    subscription.unsubscribe();
  };
}, [fetchOrCreateProfile]);

// Iniciar sesión con email y contraseña
const signInEmail = useCallback(async (email: string, password: string) => {
  setLoading(true);
  try {
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) {
      console.error(`[${TAG}] Error al iniciar sesión:`, error);
      return;
    }

    if (data?.session && data?.user) {
      setSession(data.session);
      await fetchOrCreateProfile(data.user.id);
    }
  } catch (err) {
    console.error(`[${TAG}] Error en signInEmail:`, err);
  } finally {
    setLoading(false);
  }
}, [fetchOrCreateProfile]);

// Registrar nuevo usuario
const signUpEmail = useCallback(
  async (
    email: string,
    password: string,
    fullName?: string,
    role: Role = "client"
  ) => {
    setLoading(true);
    try {
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            full_name: fullName || email.split("@")[0],
            role,
          },
        },
      });

      if (error) {
        console.error(`[${TAG}] Error al registrar usuario:`, error);
        return;
      }

      // Si se registró correctamente
      if (data?.user) {
        const userId = data.user.id;

        // Verificar si el perfil ya existe
        const { data: existingProfile } = await supabase
          .from("profiles")
          .select("id, full_name, role")
          .eq("id", userId)
          .maybeSingle();

        // Si no existe, crear el perfil con su rol
        if (!existingProfile) {
          const name = data.user.user_metadata?.full_name || fullName || email.split("@")[0];
          const { error: profileErr } = await supabase
            .from("profiles")
            .insert([{ id: userId, full_name: name, role }]);

          if (profileErr) console.error("Error creando perfil:", profileErr);
        } else {
          setProfile(existingProfile as Profile);
        }

        // Si el registro devuelve sesión directa
        if (data.session) setSession(data.session);
      }
    } catch (err) {
      console.error(`[${TAG}] Error en signUpEmail:`, err);
    } finally {
      setLoading(false);
    }
  },
  [fetchOrCreateProfile]
);



 // Iniciar sesión con Google 
const signInWithGoogle = useCallback(async () => {
  try {
    console.log(`[${TAG}] Iniciando sesión con Google...`);
    console.log(`[${TAG}] Plataforma detectada:`, Platform.OS);

    // Si se ejecuta desde navegador web
    if (Platform.OS === "web") {
      // Obtiene la URL actual del sitio para usar como callback
      const currentUrl =
        typeof window !== "undefined" ? window.location.origin : "";
      console.log(`[${TAG}] URL actual:`, currentUrl);

      // Inicia el flujo de autenticación con Google
      const { data, error } = await supabase.auth.signInWithOAuth({
        provider: "google",
        options: {
          queryParams: {
            access_type: "offline", // Permite tokens de larga duración
            prompt: "consent", // Obliga al usuario a seleccionar cuenta
          },
        },
      });

      if (error) {
        console.error(`[${TAG}] Error en signInWithOAuth:`, error);
        throw error;
      }

      console.log(`[${TAG}] Redirigiendo a Google...`);
      return;
    }

    // Si se ejecuta desde app
    const redirectTo = "onlearn://auth/callback"; 
    console.log(`[${TAG}] RedirectTo en móvil:`, redirectTo);

    // Solicita inicio de sesión con Google y obtiene URL de autorización
    const { data, error } = await supabase.auth.signInWithOAuth({
      provider: "google",
      options: {
        redirectTo,
        skipBrowserRedirect: true, // Previene redirección automática
        queryParams: {
          access_type: "offline",
          prompt: "consent",
        },
      },
    });

    if (error) {
      console.error(`[${TAG}] Error en signInWithOAuth:`, error);
      throw error;
    }

    // Verifica que Supabase devuelva una URL válida
    if (!data?.url) {
      throw new Error("Supabase no devolvió URL de redirección");
    }

    console.log(`[${TAG}] Abriendo navegador con URL:`, data.url);

    // Abre navegador externo para completar el login de Google
    const result = await WebBrowser.openAuthSessionAsync(data.url, redirectTo);

    console.log(`[${TAG}] Resultado del navegador:`, result);

    // Verifica cómo se cerró la sesión de navegador
    if (result.type === "success") {
      console.log(`[${TAG}] Login completado con éxito`);
    } else if (result.type === "cancel") {
      console.log(`[${TAG}] Usuario canceló el inicio de sesión`);
    } else {
      console.log(`[${TAG}] Resultado inesperado:`, result.type);
    }
  } catch (e: any) {
    console.error(`[${TAG}] Error en signInWithGoogle:`, e);
    throw e;
  }
}, []);


 
  const signOut = useCallback(async () => {
    try {
      console.log(`[${TAG}]Cerrando sesión...`);
      isSigningOut.current = true;
      setLoading(true);

      snapshotStorage("before:signOut");

      setSession(null);
      setProfile(null);
      profileCache.current.clear();

      const removedBefore = safeLocalStorage.clearSupabaseKeys();
      console.log(`[${TAG}] Keys removidas antes:`, removedBefore.length);

      const { error } = await supabase.auth.signOut({ scope: "local" });
      
      if (error) {
        console.error(`[${TAG}]Error en signOut (continuando):`, error);
      }

      const removedAfter = safeLocalStorage.clearSupabaseKeys();
      console.log(`[${TAG}] Keys removidas después:`, removedAfter.length);

      snapshotStorage("after:signOut");
      console.log(`[${TAG}] Sesión cerrada`);
    } catch (error) {
      console.error(`[${TAG}]Error al cerrar sesión:`, error);
      throw error;
    } finally {
      isSigningOut.current = false;
      setLoading(false);
    }
  }, []);

// Memoriza los valores del contexto de autenticación
const value = useMemo(
  () => ({
    session,           
    profile,           
    signInEmail,      
    signUpEmail,       
    signOut,          
    signInWithGoogle,  
    loading,           
  }),
  // Se recalcula solo si cambia alguno de estos valores
  [session, profile, loading, signInEmail, signUpEmail, signOut, signInWithGoogle]
);

// Este useEffect solo muestra el estado actual en consola
useEffect(() => {
  if (DEBUG) {
    console.log(`[${TAG}] Estado actual:`, {
      hasSession: !!session,         
      userEmail: session?.user?.email,
      hasProfile: !!profile,           
      profileRole: profile?.role,      
      loading,                         
    });
  }
}, [session, profile, loading]);


// Todo componente dentro de <AuthProvider> puede acceder al estado y funciones del contexto
return (
  <AuthContext.Provider value={value}>
    {children}
  </AuthContext.Provider>
);
};