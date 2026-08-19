/**
 * Supabase Browser Client
 * Singleton pattern — safe to import in Client Components ('use client').
 * Uses the public anon key; RLS policies enforce data access.
 */
import { createBrowserClient } from '@supabase/ssr';

let client;

export function getSupabaseBrowserClient() {
  if (!client) {
    client = createBrowserClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
    );
  }
  return client;
}
