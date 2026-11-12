import { createBrowserClient } from "@supabase/ssr";
import { isSupabaseConfigured, supabaseKey, supabaseUrl } from "@/lib/site";

export function createClient() {
  if (!isSupabaseConfigured()) {
    throw new Error("Supabase is not configured.");
  }
  return createBrowserClient(supabaseUrl(), supabaseKey());
}
