import { createClientComponentClient } from '@supabase/auth-helpers-nextjs';
import { useSession } from '@supabase/auth-helpers-react';
import { Database } from '../types/database';

export const supabase = createClientComponentClient<Database>();

export function useSupabase() {
  const session = useSession();
  
  return {
    supabase,
    session,
  };
}
