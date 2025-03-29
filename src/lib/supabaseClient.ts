import { createBrowserClient } from '@supabase/ssr';
import { useState, useEffect } from 'react'; // Need these for the hook
import type { SupabaseClient, Session } from '@supabase/supabase-js';
import type { Database } from '../types/database'; // Assuming your DB types are here

// Create a singleton instance for the browser client
// We only need environment variables here, ssr management happens via context/middleware
const supabaseClient = createBrowserClient<Database>(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

// Export the singleton client directly
export const supabase = supabaseClient;

// Custom hook to manage session state (replaces useSession from auth-helpers-react)
export function useSupabase() {
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const { data: authListener } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        setSession(session);
        setLoading(false);
        // Optionally: Handle specific auth events (SIGNED_IN, SIGNED_OUT, etc.)
      }
    );

    // Get initial session
    supabase.auth.getSession().then(({ data: { session } }) => {
       setSession(session);
       setLoading(false);
    });


    return () => {
      authListener?.subscription.unsubscribe();
    };
  }, []); // Run only once on mount

  return {
    supabase,
    session,
    loading, // Expose loading state if needed by components
  };
}

// Keep createClient function for potential utility, but ensure it uses ssr client
// NOTE: Generally, import the singleton `supabase` directly in components.
export function createClient() {
  return supabaseClient;
}
