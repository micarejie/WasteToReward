import { createBrowserClient } from "@supabase/ssr";
import { isSupabaseConfigured, supabaseKey } from "@/lib/site";

export function createClient() {
  if (!isSupabaseConfigured()) {
    throw new Error("Supabase is not configured.");
  }
  return createBrowserClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, supabaseKey());
}
