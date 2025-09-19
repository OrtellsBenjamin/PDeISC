
import { createClient } from "@supabase/supabase-js";

console.log(import.meta.env.VITE_SUPABASE_URL)

const supabaseUrl = import.meta.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

// Crear una sola instancia de Supabase
export const supabase = createClient(supabaseUrl, supabaseAnonKey);
