// src/lib/supabaseClient.js
import { createClient } from "@supabase/supabase-js";

// Usar las variables de entorno de Vercel
const supabaseUrl = import.meta.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

// Crear una sola instancia de Supabase
export const supabase = createClient(supabaseUrl, supabaseAnonKey);
