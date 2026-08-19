/**
 * Supabase Server Client
 * Used in Server Components, Server Actions, and middleware.
 * Reads/writes cookies via Next.js `cookies()` so the session
 * is persisted across requests without exposing the service key.
 */
import { createServerClient } from '@supabase/ssr';
import { cookies } from 'next/headers';

export async function createClient() {
  const cookieStore = await cookies();

  return createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
    {
      cookies: {
        getAll() {
          return cookieStore.getAll();
        },
        setAll(cookiesToSet) {
          try {
            cookiesToSet.forEach(({ name, value, options }) =>
              cookieStore.set(name, value, options)
            );
          } catch {
            // setAll can be called from a Server Component where
            // mutation is not allowed — safe to ignore in that case.
          }
        },
      },
    }
  );
}
