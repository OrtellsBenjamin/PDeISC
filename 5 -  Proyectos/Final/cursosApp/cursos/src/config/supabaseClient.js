import { createClient } from "@supabase/supabase-js";
import AsyncStorage from "@react-native-async-storage/async-storage";

//Detectar si está en web o móvil
const isWeb = typeof window !== "undefined";

//Cliente Supabase para FRONTEND (anon key)
export const supabase = createClient(
  "https://sihlbryyokpepujxatut.supabase.co",
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InNpaGxicnl5b2twZXB1anhhdHV0Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjEzOTk0MzksImV4cCI6MjA3Njk3NTQzOX0.F9mDlw2XMCAt2BGudE5ohvdHAAH5TrYZqDQbz1VplgI",
  {
    auth: {
      storage: isWeb ? localStorage : AsyncStorage,
      autoRefreshToken: true,
      persistSession: true,
      detectSessionInUrl: true,
    },
  }
);

console.log(`🔧 Supabase FRONTEND configurado para: ${isWeb ? "Web" : "Móvil"}`);
