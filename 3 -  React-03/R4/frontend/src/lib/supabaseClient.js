// src/lib/supabaseClient.js
import { createClient } from "@supabase/supabase-js";


import { createClient } from '@supabase/supabase-js'

const supabaseUrl = 'https://nghugcxwubiwxbjmzhka.supabase.co'
const supabaseKey = process.env.SUPABASE_KEY

export const supabase = createClient(supabaseUrl, supabaseKey);
