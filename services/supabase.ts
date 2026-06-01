import { createClient } from '@supabase/supabase-js';
import AsyncStorage from '@react-native-async-storage/async-storage';

const supabaseUrl = 'https://apkryrdbhddsokixckdx.supabase.co';
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImFwa3J5cmRiaGRkc29raXhja2R4Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzU2NjQyNDUsImV4cCI6MjA5MTI0MDI0NX0.leK8cpJTdTQ2CYkx8CsTyZfE6YMfg4N0PAAVA2tcAtM';

export const isSupabaseConfigured = true;

export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    storage: AsyncStorage,
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: false,
  },
});
