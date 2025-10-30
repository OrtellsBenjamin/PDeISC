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

// ====== Tipos ======
type Role = "client" | "instructor" | "admin" | "pending_instructor"; // 👈 AGREGADO pending_instructor
type Profile = { id: string; full_name: string | null; role: Role };

type Ctx = {
  session: any;
  profile: Profile | null;
  signInEmail: (email: string, password: string) => Promise<void>;
  signUpEmail: (
    email: string,
    password: string,
    fullName?: string,
    role?: Role // 👈 AGREGADO parámetro role
  ) => Promise<void>;
  signOut: () => Promise<void>;
  signInWithGoogle: () => Promise<void>;
  loading: boolean;
};

export const AuthContext = createContext<Ctx>({} as any);

// ====== Helpers ======
const DEBUG = true;
const TAG = "AUTH";

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
  clearSupabaseKeys() {
    const keys = safeLocalStorage.keys().filter((k) =>
      k.toLowerCase().includes("supabase")
    );
    keys.forEach((k) => safeLocalStorage.remove(k));
    return keys;
  },
};

function snapshotStorage(where: string) {
  if (!DEBUG) return;
  const keys = safeLocalStorage
    .keys()
    .filter((k) => k.toLowerCase().includes("supabase"));
  console.log(`[${TAG}] 📦 Storage @${where}:`, keys);
}

// ====== AuthProvider ======
export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [session, setSession] = useState<any>(null);
  const [profile, setProfile] = useState<Profile | null>(null);
  const [loading, setLoading] = useState(true);

  const initComplete = useRef(false);
  const loadingProfileUserId = useRef<string | null>(null);
  const isSigningOut = useRef(false);
  const profileCache = useRef<Map<string, Profile>>(new Map());

  // ============== FETCH/CREATE PROFILE ==============
  const fetchOrCreateProfile = useCallback(async (userId: string): Promise<Profile | null> => {
    if (profileCache.current.has(userId)) {
      const cached = profileCache.current.get(userId)!;
      console.log(`[${TAG}] 💾 Perfil en cache:`, cached);
      setProfile(cached);
      return cached;
    }

    if (loadingProfileUserId.current === userId) {
      console.log(`[${TAG}] ⏳ Ya estamos cargando el perfil para:`, userId);
      await new Promise(resolve => setTimeout(resolve, 500));
      if (profileCache.current.has(userId)) {
        const cached = profileCache.current.get(userId)!;
        setProfile(cached);
        return cached;
      }
      console.log(`[${TAG}] ⚠️ Perfil no se cargó después de esperar`);
      return null;
    }

    loadingProfileUserId.current = userId;
    console.log(`[${TAG}] 📡 Cargando perfil de DB para:`, userId);

    try {
      const timeoutPromise = new Promise<null>((_, reject) => 
        setTimeout(() => reject(new Error('Timeout al cargar perfil')), 10000)
      );

      const fetchPromise = (async () => {
        console.log(`[${TAG}] 🔍 Ejecutando query SELECT profiles...`);
        
        const { data, error } = await supabase
          .from("profiles")
          .select("id, full_name, role")
          .eq("id", userId)
          .maybeSingle();

        console.log(`[${TAG}] 📨 Respuesta de SELECT:`, { 
          hasData: !!data, 
          hasError: !!error,
          errorMsg: error?.message,
          errorCode: error?.code 
        });

        if (error) {
          console.error(`[${TAG}] ❌ Error al cargar perfil:`, error);
          throw error;
        }

        if (data) {
          console.log(`[${TAG}] ✅ Perfil encontrado:`, data);
          const prof = data as Profile;
          profileCache.current.set(userId, prof);
          setProfile(prof);
          return prof;
        }

        const newProfile = {
          id: userId,
          full_name: "Usuario",
          role: "client" as Role,
        };

        console.log(`[${TAG}] 🧱 Creando nuevo perfil:`, newProfile);
        console.log(`[${TAG}] 🔍 Ejecutando query INSERT profiles...`);

        const { data: inserted, error: insErr } = await supabase
          .from("profiles")
          .insert([newProfile])
          .select("id, full_name, role")
          .single();

        console.log(`[${TAG}] 📨 Respuesta de INSERT:`, { 
          hasData: !!inserted, 
          hasError: !!insErr,
          errorMsg: insErr?.message 
        });

        if (insErr) {
          console.error(`[${TAG}] ❌ Error al crear perfil:`, insErr);
          throw insErr;
        }

        console.log(`[${TAG}] 🎉 Perfil creado:`, inserted);
        const prof = inserted as Profile;
        profileCache.current.set(userId, prof);
        setProfile(prof);
        return prof;
      })();

      const result = await Promise.race([fetchPromise, timeoutPromise]);
      return result;

    } catch (e: any) {
      console.error(`[${TAG}] 💥 Excepción en fetchOrCreateProfile:`, {
        message: e?.message,
        code: e?.code,
        details: e?.details,
        hint: e?.hint,
        stack: e?.stack?.split('\n')[0]
      });
      
      setProfile(null);
      return null;
    } finally {
      console.log(`[${TAG}] 🏁 fetchOrCreateProfile finalizado para:`, userId);
      loadingProfileUserId.current = null;
    }
  }, []);

  // ============== MANEJO DE DEEP LINKS (OAuth callback) ==============
  useEffect(() => {
    const handleDeepLink = async (event: { url: string }) => {
      console.log(`[${TAG}] 🔗 Deep link recibido:`, event.url);

      const url = new URL(event.url);
      const access_token = url.searchParams.get('access_token');
      const refresh_token = url.searchParams.get('refresh_token');
      
      const hashParams = new URLSearchParams(url.hash.substring(1));
      const hashAccessToken = hashParams.get('access_token');
      const hashRefreshToken = hashParams.get('refresh_token');

      const finalAccessToken = access_token || hashAccessToken;
      const finalRefreshToken = refresh_token || hashRefreshToken;

      if (finalAccessToken) {
        console.log(`[${TAG}] ✅ Tokens OAuth recibidos, estableciendo sesión...`);
        
        try {
          const { data, error } = await supabase.auth.setSession({
            access_token: finalAccessToken,
            refresh_token: finalRefreshToken || '',
          });

          if (error) {
            console.error(`[${TAG}] ❌ Error al establecer sesión:`, error);
            return;
          }

          console.log(`[${TAG}] 🎉 Sesión OAuth establecida exitosamente`);
        } catch (err) {
          console.error(`[${TAG}] 💥 Error procesando deep link:`, err);
        }
      }
    };

    Linking.getInitialURL().then((url) => {
      if (url) {
        console.log(`[${TAG}] 🔗 Deep link inicial:`, url);
        handleDeepLink({ url });
      }
    });

    const subscription = Linking.addEventListener('url', handleDeepLink);

    return () => {
      subscription.remove();
    };
  }, []);

  // ============== INICIALIZACIÓN + LISTENER ==============
  useEffect(() => {
    let mounted = true;

    const initialize = async () => {
      console.log(`[${TAG}] 🚀 Inicializando AuthContext...`);
      snapshotStorage("init:start");

      try {
        await new Promise(resolve => setTimeout(resolve, 100));

        const { data: { session: currentSession }, error } = 
          await supabase.auth.getSession();

        if (error) {
          console.error(`[${TAG}] ⚠️ Error en getSession:`, error);
        }

        if (!mounted) return;

        if (currentSession) {
          console.log(
            `[${TAG}] ✅ Sesión encontrada en init:`,
            currentSession.user.email
          );
          
          setSession(currentSession);
          
          try {
            await fetchOrCreateProfile(currentSession.user.id);
          } catch (err) {
            console.error(`[${TAG}] ⚠️ Error cargando perfil en init:`, err);
            setProfile(null);
          }
        } else {
          console.log(`[${TAG}] ℹ️ No hay sesión en init`);
          setSession(null);
          setProfile(null);
        }
      } catch (err) {
        console.error(`[${TAG}] 💥 Error en initialize:`, err);
        if (mounted) {
          setSession(null);
          setProfile(null);
        }
      } finally {
        if (mounted) {
          initComplete.current = true;
          setLoading(false);
          snapshotStorage("init:end");
          console.log(`[${TAG}] 🏁 Inicialización completa`);
        }
      }
    };

    initialize();

    console.log(`[${TAG}] 👂 Registrando listener de auth state...`);

    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, currentSession) => {
        if (!mounted) return;

        console.log(`[${TAG}] 🔔 Auth event: ${event}`, currentSession?.user?.email);
        snapshotStorage(`event:${event}`);

        if (isSigningOut.current) {
          console.log(`[${TAG}] ⏸️ Ignorando ${event} durante signOut`);
          return;
        }

        if (event === "SIGNED_OUT") {
          console.log(`[${TAG}] 👋 Usuario deslogueado`);
          setSession(null);
          setProfile(null);
          profileCache.current.clear();
          safeLocalStorage.clearSupabaseKeys();
          if (initComplete.current) {
            setLoading(false);
          }
          return;
        }

        if (event === "INITIAL_SESSION") {
          if (!currentSession) {
            console.log(`[${TAG}] ℹ️ INITIAL_SESSION sin sesión`);
            if (initComplete.current) {
              setSession(null);
              setProfile(null);
              setLoading(false);
            }
            return;
          }

          if (initComplete.current) {
            console.log(`[${TAG}] ⏭️ Ignorando INITIAL_SESSION (ya inicializado)`);
            return;
          }

          console.log(`[${TAG}] 🔄 Procesando INITIAL_SESSION`);
          setSession(currentSession);
          
          try {
            await fetchOrCreateProfile(currentSession.user.id);
          } catch (err) {
            console.error(`[${TAG}] ⚠️ Error cargando perfil en INITIAL_SESSION:`, err);
          } finally {
            if (initComplete.current) {
              setLoading(false);
            }
          }
          return;
        }

        if (event === "SIGNED_IN" && currentSession) {
          console.log(`[${TAG}] 🔑 Usuario logueado:`, currentSession.user.email);
          setSession(currentSession);
          
          try {
            await fetchOrCreateProfile(currentSession.user.id);
          } catch (err) {
            console.error(`[${TAG}] ⚠️ Error cargando perfil en SIGNED_IN:`, err);
          } finally {
            setLoading(false);
          }
          return;
        }

        if (event === "TOKEN_REFRESHED" && currentSession) {
          console.log(`[${TAG}] 🔄 Token refrescado`);
          setSession(currentSession);
          return;
        }

        if (event === "USER_UPDATED" && currentSession) {
          console.log(`[${TAG}] 👤 Usuario actualizado`);
          setSession(currentSession);
          
          profileCache.current.delete(currentSession.user.id);
          await fetchOrCreateProfile(currentSession.user.id);
          return;
        }

        console.log(`[${TAG}] ℹ️ Evento no manejado:`, event);
      }
    );

    return () => {
      mounted = false;
      console.log(`[${TAG}] 🔇 Desregistrando listener`);
      subscription.unsubscribe();
    };
  }, [fetchOrCreateProfile]);

  // ============== SIGN IN ==============
  const signInEmail = useCallback(async (email: string, password: string) => {
    console.log(`[${TAG}] 🔑 Iniciando sesión:`, email);
    setLoading(true);

    try {
      snapshotStorage("before:signIn");
      
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      snapshotStorage("after:signIn");

      if (error) {
        console.error(`[${TAG}] ❌ Error en signIn:`, error);
        setLoading(false);
        throw new Error(error.message);
      }

      if (!data.session || !data.user) {
        setLoading(false);
        throw new Error("No se recibió sesión del servidor");
      }

      console.log(`[${TAG}] ✅ Login exitoso:`, data.user.email);
    } catch (error) {
      setLoading(false);
      throw error;
    }
  }, []);

  // ============== SIGN UP ==============
  const signUpEmail = useCallback(
    async (
      email: string,
      password: string,
      fullName?: string,
      role: Role = "client" // 👈 AGREGADO parámetro con default
    ) => {
      console.log(`[${TAG}] 🆕 Registrando usuario:`, { email, fullName, role }); // 👈 LOG del rol
      setLoading(true);

      try {
        snapshotStorage("before:signUp");

        // 🔹 Registrar usuario en Supabase Auth
        const { data, error } = await supabase.auth.signUp({
          email,
          password,
          options: {
            data: { 
              full_name: fullName || email.split('@')[0],
              role // 👈 Enviando el rol en metadata
            },
          },
        });

        snapshotStorage("after:signUp");

        if (error) {
          console.error(`[${TAG}] ❌ Error en signUp:`, error);
          setLoading(false);
          throw new Error(error.message);
        }

        if (!data.user) {
          setLoading(false);
          throw new Error("No se recibió usuario del servidor");
        }

        console.log(`[${TAG}] ✅ Registro exitoso:`, data.user.email);
        console.log(`[${TAG}] 📋 User metadata:`, data.user.user_metadata); // 👈 Verificar metadata
        console.log(`[${TAG}] 🎭 Rol enviado:`, role); // 👈 LOG del rol

        // ✅ Esperar un poco para asegurarse que no hay race condition con el trigger
        await new Promise(resolve => setTimeout(resolve, 500));

        // 🔹 Verificar si ya existe el perfil (creado por trigger)
        const { data: existingProfile } = await supabase
          .from("profiles")
          .select("id, full_name, role")
          .eq("id", data.user.id)
          .maybeSingle();

        if (existingProfile) {
          console.log(`[${TAG}] ✅ Perfil ya existe:`, existingProfile);
          console.log(`[${TAG}] 🎭 Rol del perfil existente:`, existingProfile.role); // 👈 LOG
          
          // Si el trigger creó el perfil con rol incorrecto, actualizarlo
          if (existingProfile.role !== role) {
            console.log(`[${TAG}] 🔄 Rol incorrecto, actualizando de "${existingProfile.role}" a "${role}"...`);
            const { data: updated, error: updateErr } = await supabase
              .from("profiles")
              .update({ 
                full_name: fullName || existingProfile.full_name,
                role // 👈 Actualizar al rol correcto
              })
              .eq("id", data.user.id)
              .select("id, full_name, role")
              .single();
            
            if (updateErr) {
              console.error(`[${TAG}] ❌ Error actualizando rol:`, updateErr);
            } else {
              console.log(`[${TAG}] ✅ Rol actualizado correctamente:`, updated);
              setProfile(updated as Profile);
            }
          } else {
            setProfile(existingProfile as Profile);
          }
        } else {
          // Si no existe, crearlo manualmente
          console.log(`[${TAG}] 🧩 Creando perfil manualmente con rol:`, role);
          const metaName = data.user.user_metadata?.full_name || fullName || email.split('@')[0];

          const { data: profileData, error: profileErr } = await supabase
            .from("profiles")
            .insert([
              {
                id: data.user.id,
                full_name: metaName,
                role, // 👈 Usar el rol correcto
              },
            ])
            .select("id, full_name, role")
            .single();

          if (profileErr) {
            console.error(`[${TAG}] ⚠️ Error creando perfil:`, profileErr);
          } else {
            console.log(`[${TAG}] 🎉 Perfil creado correctamente:`, profileData);
            setProfile(profileData as Profile);
          }
        }

        if (!data.session) {
          console.log(`[${TAG}] 📧 Confirmación de email requerida`);
          setLoading(false);
          return;
        }

        setSession(data.session);
      } catch (error) {
        console.error(`[${TAG}] ❌ Error final en signUp:`, error);
        setLoading(false);
        throw error;
      } finally {
        setLoading(false);
      }
    },
    []
  );

  // ============== SIGN IN WITH GOOGLE ==============
  const signInWithGoogle = useCallback(async () => {
    try {
      console.log(`[${TAG}] 🔑 Iniciando sesión con Google...`);
      console.log(`[${TAG}] 🌍 Platform:`, Platform.OS);

      if (Platform.OS === 'web') {
        const currentUrl = typeof window !== 'undefined' ? window.location.origin : '';
        console.log(`[${TAG}] 🌍 Current URL:`, currentUrl);

        const { data, error } = await supabase.auth.signInWithOAuth({
          provider: "google",
          options: {
            queryParams: {
              access_type: "offline",
              prompt: "consent",
            },
          },
        });

        if (error) {
          console.error(`[${TAG}] ❌ Error en signInWithOAuth:`, error);
          throw error;
        }

        console.log(`[${TAG}] ✅ Redirigiendo a Google...`);
        return;
      }

      const redirectTo = "onlearn://auth/callback";
      console.log(`[${TAG}] 🌍 redirectTo (mobile):`, redirectTo);

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
        console.error(`[${TAG}] ❌ Error en signInWithOAuth:`, error);
        throw error;
      }

      if (!data?.url) {
        throw new Error("Supabase no devolvió URL de redirección");
      }

      console.log(`[${TAG}] 🚀 Abriendo navegador con:`, data.url);

      const result = await WebBrowser.openAuthSessionAsync(
        data.url,
        redirectTo
      );

      console.log(`[${TAG}] 🔁 Resultado del navegador:`, result);

      if (result.type === "success") {
        console.log(`[${TAG}] ✅ Navegador cerrado con éxito`);
      } else if (result.type === "cancel") {
        console.log(`[${TAG}] ⚠️ Usuario canceló el login`);
      } else {
        console.log(`[${TAG}] ⚠️ Resultado inesperado:`, result.type);
      }
    } catch (e: any) {
      console.error(`[${TAG}] 💥 Error en signInWithGoogle:`, e);
      throw e;
    }
  }, []);

  // ============== SIGN OUT ==============
  const signOut = useCallback(async () => {
    try {
      console.log(`[${TAG}] 🚪 Cerrando sesión...`);
      isSigningOut.current = true;
      setLoading(true);

      snapshotStorage("before:signOut");

      setSession(null);
      setProfile(null);
      profileCache.current.clear();

      const removedBefore = safeLocalStorage.clearSupabaseKeys();
      console.log(`[${TAG}] 🗑️ Keys removidas antes:`, removedBefore.length);

      const { error } = await supabase.auth.signOut({ scope: "local" });
      
      if (error) {
        console.error(`[${TAG}] ⚠️ Error en signOut (continuando):`, error);
      }

      const removedAfter = safeLocalStorage.clearSupabaseKeys();
      console.log(`[${TAG}] 🗑️ Keys removidas después:`, removedAfter.length);

      snapshotStorage("after:signOut");
      console.log(`[${TAG}] ✅ Sesión cerrada`);
    } catch (error) {
      console.error(`[${TAG}] ❌ Error al cerrar sesión:`, error);
      throw error;
    } finally {
      isSigningOut.current = false;
      setLoading(false);
    }
  }, []);

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
    [session, profile, loading, signInEmail, signUpEmail, signOut, signInWithGoogle]
  );

  useEffect(() => {
    if (DEBUG) {
      console.log(`[${TAG}] 📊 Estado actual:`, {
        hasSession: !!session,
        userEmail: session?.user?.email,
        hasProfile: !!profile,
        profileRole: profile?.role,
        loading,
      });
    }
  }, [session, profile, loading]);

  return (
    <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
  );
};