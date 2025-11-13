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
import Toast from "react-native-toast-message";

WebBrowser.maybeCompleteAuthSession();

// Mis tipos de usuario
type Role = "client" | "instructor" | "admin" | "pending_instructor";
type Profile = { id: string; full_name: string | null; role: Role };

//Contexto de autenticación
type Ctx = {
  session: any;
  profile: Profile | null;
  signInEmail: (
    email: string,
    password: string
  ) => Promise<{ ok: boolean; error?: any }>;
  signUpEmail: (
    email: string,
    password: string,
    fullName?: string,
    role?: Role
  ) => Promise<void>;
  signOut: () => Promise<void>;
  signInWithGoogle: () => Promise<void>;
  signInWithGitHub: () => Promise<void>;
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
    const keys = safeLocalStorage
      .keys()
      .filter((k) => k.toLowerCase().includes("supabase"));
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
  console.log(`[${TAG}]Storage @${where}:`, keys);
}

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [session, setSession] = useState<any>(null);
  const [profile, setProfile] = useState<Profile | null>(null);
  const [loading, setLoading] = useState(true);
  const [pendingRedirect, setPendingRedirect] = useState<boolean>(false);

  const initComplete = useRef(false);
  const isSigningOut = useRef(false);
  //Una vez que cargue el perfil, lo toma del cache
  const profileCache = useRef<Map<string, Profile>>(new Map());
  const fetchingProfiles = useRef<Map<string, Promise<Profile | null>>>(new Map());

  const fetchOrCreateProfile = useCallback(
    async (userId: string): Promise<Profile | null> => {
      if (profileCache.current.has(userId)) {
        const cached = profileCache.current.get(userId)!;
        setProfile(cached);
        console.log(`[${TAG}] Perfil desde cache:`, cached.full_name);
        return cached;
      }

      if (fetchingProfiles.current.has(userId)) {
        console.log(`[${TAG}] Esperando fetch existente para userId:`, userId);
        return fetchingProfiles.current.get(userId)!;
      }

      const fetchPromise = (async (): Promise<Profile | null> => {
        try {
          console.log(`[${TAG}] Obteniendo perfil para userId:`, userId);
          
          const { data, error } = await supabase
            .from("profiles")
            .select("id, full_name, role")
            .eq("id", userId)
            .maybeSingle();

          if (error) {
            console.error(`[${TAG}] Error al obtener perfil:`, error);
            throw error;
          }

          if (data) {
            const prof = data as Profile;
            profileCache.current.set(userId, prof);
            setProfile(prof);
            console.log(`[${TAG}] Perfil encontrado:`, prof.full_name);
            return prof;
          }

          console.log(`[${TAG}] Perfil no existe, creando nuevo...`);
          const { data: userData } = await supabase.auth.getUser();
          const user = userData?.user;

          const fullName =
            user?.user_metadata?.full_name ||
            user?.user_metadata?.name ||
            user?.user_metadata?.user_name ||
            user?.email?.split("@")[0] ||
            "Sin nombre";

          const roleFromMetadata =
            (user?.user_metadata?.role as Role) || "client";

          const newProfile = {
            id: userId,
            full_name: fullName,
            role: roleFromMetadata,
          };

          const { data: inserted, error: insErr } = await supabase
            .from("profiles")
            .insert([newProfile])
            .select("id, full_name, role")
            .single();

          if (insErr) {
            console.error(`[${TAG}] Error al insertar perfil:`, insErr);
            throw insErr;
          }

          const prof = inserted as Profile;
          profileCache.current.set(userId, prof);
          setProfile(prof);
          console.log(`[${TAG}] Perfil creado:`, prof.full_name);
          return prof;
        } catch (e: any) {
          console.error(`[${TAG}] Excepción en fetchOrCreateProfile:`, e?.message);
          setProfile(null);
          return null;
        } finally {
          fetchingProfiles.current.delete(userId);
        }
      })();

      fetchingProfiles.current.set(userId, fetchPromise);
      return fetchPromise;
    },
    []
  );

  useEffect(() => {
    const handleDeepLink = async (event: { url: string }) => {
      console.log(`[${TAG}] 🔗 Deep link recibido:`, event.url);

      try {
        const url = new URL(event.url);

        const access_token =
          url.searchParams.get("access_token") ||
          new URLSearchParams(url.hash.substring(1)).get("access_token");
        const refresh_token =
          url.searchParams.get("refresh_token") ||
          new URLSearchParams(url.hash.substring(1)).get("refresh_token");

        if (!access_token) {
          console.log(`[${TAG}]Deep link sin tokens válidos`);
          return;
        }

        console.log(`[${TAG}]Tokens OAuth recibidos, estableciendo sesión...`);

        const { data, error } = await supabase.auth.setSession({
          access_token,
          refresh_token: refresh_token || "",
        });

        if (error) {
          console.error(`[${TAG}]Error al establecer sesión:`, error);
          return;
        }

        console.log(`[${TAG}]Sesión OAuth establecida correctamente`);

        // Redirigir manualmente tras login OAuth (solo móvil)
        if (Platform.OS !== "web") {
          setTimeout(() => {
            console.log(`[${TAG}]Redirigiendo a Home tras OAuth móvil`);
            Linking.openURL("onlearn://home");
          }, 800);
        }
      } catch (err) {
        console.error(`[${TAG}]Error procesando deep link:`, err);
      }
    };

    // Procesar deep link si la app fue abierta desde uno
    Linking.getInitialURL().then((url) => {
      if (url) {
        console.log(`[${TAG}]Deep link inicial detectado:`, url);
        handleDeepLink({ url });
      }
    });

    // Escuchar nuevos deep links
    const subscription = Linking.addEventListener("url", handleDeepLink);

    return () => {
      subscription.remove();
    };
  }, []);

  useEffect(() => {
    let mounted = true;

    const initialize = async () => {
      console.log(`[${TAG}]Inicializando AuthContext...`);
      snapshotStorage("init:start");

      try {
        const {
          data: { session: currentSession },
          error,
        } = await supabase.auth.getSession();

        if (error) {
          console.error(`[${TAG}]Error al obtener sesión:`, error);
        }
        
        if (!mounted) return;

        if (
          currentSession &&
          currentSession.user &&
          currentSession.access_token
        ) {
          console.log(
            `[${TAG}]Sesión válida encontrada:`,
            currentSession.user.email
          );
          setSession(currentSession);

          await fetchOrCreateProfile(currentSession.user.id);
        } else {
          console.log(`[${TAG}]No hay sesión activa o token inválido`);
          setSession(null);
          setProfile(null);
        }
      } catch (err) {
        console.error(`[${TAG}]Error general en initialize():`, err);
        if (mounted) {
          setSession(null);
          setProfile(null);
        }
      } finally {
        if (mounted) {
          initComplete.current = true;
          console.log(`[${TAG}]Inicialización completada, liberando loading`);
          setLoading(false);
          snapshotStorage("init:end");
        }
      }
    };

    initialize();

    console.log(`[${TAG}]Registrando listener de autenticación...`);

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange(async (event, currentSession) => {
      if (!mounted) return;

      console.log(
        `[${TAG}]Evento de autenticación: ${event}`,
        currentSession?.user?.email
      );
      snapshotStorage(`event:${event}`);

      if (isSigningOut.current) return;

      switch (event) {
        case "SIGNED_OUT":
          if (!session) {
            console.log(`[${TAG}]SIGNED_OUT redundante ignorado`);
            break;
          }
          console.log(`[${TAG}]Usuario deslogueado`);
          setSession(null);
          setProfile(null);
          profileCache.current.clear();
          safeLocalStorage.clearSupabaseKeys();
          break;

        case "INITIAL_SESSION":
          if (!initComplete.current) {
            console.log(`[${TAG}]INITIAL_SESSION durante init, ignorado`);
            break;
          }
          if (
            !currentSession ||
            !currentSession.user ||
            !currentSession.access_token
          ) {
            console.log(`[${TAG}]Sesión inicial inválida`);
            setSession(null);
            setProfile(null);
            break;
          }
          console.log(`[${TAG}]Procesando sesión inicial`);
          setSession(currentSession);
          await fetchOrCreateProfile(currentSession.user.id);
          break;

        case "SIGNED_IN":
          if (
            !currentSession ||
            !currentSession.user ||
            !currentSession.access_token
          ) {
            console.warn(`[${TAG}]SIGNED_IN sin sesión válida`);
            await supabase.auth.signOut({ scope: "local" });
            setSession(null);
            setProfile(null);
            break;
          }

          console.log(`[${TAG}]Usuario logueado:`, currentSession.user.email);
          setLoading(true);
          setSession(currentSession);

          await fetchOrCreateProfile(currentSession.user.id);
          setLoading(false);
          break;

        case "TOKEN_REFRESHED":
          if (currentSession) {
            console.log(`[${TAG}]Token refrescado`);
            setSession(currentSession);
          }
          break;

        case "USER_UPDATED":
          if (currentSession) {
            console.log(`[${TAG}]Usuario actualizado`);
            setSession(currentSession);
            profileCache.current.delete(currentSession.user.id);
            await fetchOrCreateProfile(currentSession.user.id);
          }
          break;

        default:
          console.log(`[${TAG}]Evento no manejado:`, event);
          break;
      }
    });

    return () => {
      mounted = false;
      console.log(`[${TAG}]Desregistrando listener`);
      subscription.unsubscribe();
    };
  }, [fetchOrCreateProfile]);

  const signInEmail = useCallback(
    async (email: string, password: string) => {
      console.log(`[${TAG}]Iniciando sesión con email...`);
      setLoading(true);

      try {
        //limpieza previa completa
        await supabase.auth.signOut({ scope: "local" });
        await new Promise((r) => setTimeout(r, 300));
        setSession(null);
        setProfile(null);

        //Primer intento de login
        let { data, error } = await supabase.auth.signInWithPassword({
          email: email.trim(),
          password: password.trim(),
        });

        //Retry automático si da "Invalid login credentials" o error 400
        if (error && error.message.toLowerCase().includes("invalid")) {
          console.warn(`[${TAG}]Primer intento inválido, reintentando...`);
          await new Promise((r) => setTimeout(r, 600));
          await supabase.auth.signOut({ scope: "local" });
          ({ data, error } = await supabase.auth.signInWithPassword({
            email: email.trim(),
            password: password.trim(),
          }));
        }

        if (error) {
          console.error(`[${TAG}]Error al iniciar sesión:`, error.message);
          return { ok: false, error };
        }

        if (data?.session && data?.user) {
          console.log(`[${TAG}]Login exitoso para:`, data.user.email);
          setSession(data.session);
          await fetchOrCreateProfile(data.user.id);
          return { ok: true };
        }

        console.warn(`[${TAG}]Login sin sesión retornada`);
        return { ok: false, error: new Error("No se creó sesión válida") };
      } catch (err) {
        console.error(`[${TAG}]Excepción en signInEmail:`, err);
        return { ok: false, error: err };
      } finally {
        setLoading(false);
      }
    },
    [fetchOrCreateProfile]
  );

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
            const name =
              data.user.user_metadata?.full_name ||
              fullName ||
              email.split("@")[0];
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
        const currentUrl =
          typeof window !== "undefined" ? window.location.origin : "";
        const { data, error } = await supabase.auth.signInWithOAuth({
          provider: "google",
          options: {
            redirectTo: `${currentUrl}/auth/callback`,
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
          skipBrowserRedirect: true,
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
      const result = await WebBrowser.openAuthSessionAsync(
        data.url,
        redirectTo
      );

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

  //Iniciar sesión con GitHub
  const signInWithGitHub = useCallback(async () => {
    try {
      console.log(`[${TAG}] Iniciando sesión con GitHub...`);

      //En navegador web
      if (Platform.OS === "web") {
        const currentUrl =
          typeof window !== "undefined" ? window.location.origin : "";
        const { data, error } = await supabase.auth.signInWithOAuth({
          provider: "github",
          options: {
            redirectTo: `${currentUrl}/auth/callback`,
          },
        });

        if (error) throw error;
        console.log(`[${TAG}] Redirigiendo a GitHub (web)...`);
        return;
      }

      //En movil
      const redirectTo = "onlearn://auth/callback";
      console.log(`[${TAG}] RedirectTo móvil:`, redirectTo);

      const { data, error } = await supabase.auth.signInWithOAuth({
        provider: "github",
        options: {
          redirectTo,
          skipBrowserRedirect: true,
        },
      });

      if (error) throw error;
      if (!data?.url) throw new Error("Supabase no devolvió URL para GitHub");

      console.log(`[${TAG}] Abriendo navegador para GitHub...`);
      const result = await WebBrowser.openAuthSessionAsync(
        data.url,
        redirectTo
      );

      if (result.type === "success") {
        console.log(`[${TAG}]GitHub OAuth completado`);
      } else if (result.type === "cancel") {
        Toast.show({
          type: "info",
          text1: "Inicio cancelado",
          text2: "Cerrá la ventana e intentá nuevamente.",
        });
      } else {
        Toast.show({
          type: "error",
          text1: "Error con GitHub",
          text2: "No se pudo completar el inicio de sesión.",
        });
      }

      console.log(`[${TAG}] Resultado del navegador GitHub:`, result);
    } catch (e) {
      console.error(`[${TAG}] Error en signInWithGitHub:`, e);
      Toast.show({
        type: "error",
        text1: "Error en inicio con GitHub",
        text2: e?.message || "Revisá tu conexión e intentá nuevamente.",
      });
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
      signInWithGitHub,
      loading,
    }),
    // Se recalcula solo si cambia alguno de estos valores
    [
      session,
      profile,
      loading,
      signInEmail,
      signUpEmail,
      signOut,
      signInWithGoogle,
      signInWithGitHub,
    ]
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
  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};