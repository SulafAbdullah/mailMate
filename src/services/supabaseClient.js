// src/services/supabaseClient.js
// This file initializes the Supabase client using environment variables for the URL and anon key.

import { createClient } from '@supabase/supabase-js';

console.log("Supabase URL:", import.meta.env.VITE_SUPABASE_URL);
console.log("Supabase Key exists:", !!import.meta.env.VITE_SUPABASE_ANON_KEY);

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error('Missing Supabase environment variables in .env.local');
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey);