import { createClient } from "@supabase/supabase-js";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

// Validate env vars at startup - log warning if missing
if (!supabaseUrl || !supabaseAnonKey) {
  console.warn(
    "[Supabase] Missing environment variables:",
    !supabaseUrl ? "NEXT_PUBLIC_SUPABASE_URL" : "",
    !supabaseAnonKey ? "NEXT_PUBLIC_SUPABASE_ANON_KEY" : ""
  );
}

// Log the Supabase URL in dev mode (without the key) for debugging
if (process.env.NODE_ENV === "development" && supabaseUrl) {
  console.log("[Supabase] Connecting to:", supabaseUrl);
}

export const supabase = createClient(
  supabaseUrl || "https://placeholder.supabase.co",
  supabaseAnonKey || "placeholder-key"
);

// Export a helper to check if Supabase is properly configured
export const isSupabaseConfigured = Boolean(supabaseUrl && supabaseAnonKey);
