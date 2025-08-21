import "react-native-url-polyfill/auto";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { createClient } from "@supabase/supabase-js";

const supabaseUrl = "https://cgfapydmhzjuibtwygrf.supabase.co";
const supabaseAnonKey =
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImNnZmFweWRtaHpqdWlidHd5Z3JmIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTU3NzYzMTEsImV4cCI6MjA3MTM1MjMxMX0.EZz-c8CDGqgZ4Z4lwQgp9bRlEao2JlqgRQflp55Dyxo";

export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    storage: AsyncStorage,
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: false,
  },
});
