'use client';

import { ReactNode } from 'react';
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs';
import { SessionContextProvider } from '@supabase/auth-helpers-react';
import { TaskRoutingProvider } from '../context/TaskRoutingContext';
import { FlowProvider } from '../context/FlowContext';
import { Database } from '../types/supabase';
import type { SupabaseSession } from '../types/supabase';

interface ProvidersProps {
  children: ReactNode;
  initialSession: SupabaseSession;
}

export function Providers({ children, initialSession }: ProvidersProps) {
  const supabase = createClientComponentClient<Database>();

  return (
    <SessionContextProvider 
      supabaseClient={supabase} 
      initialSession={initialSession}
    >
      <FlowProvider>
        <TaskRoutingProvider
          options={{
            autoRoute: true,
            sessionDuration: 90,
            minFlowScore: 70
          }}
        >
          {children}
        </TaskRoutingProvider>
      </FlowProvider>
    </SessionContextProvider>
  );
}