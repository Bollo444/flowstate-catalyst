"use client";

import { ReactNode } from "react";
// Removed imports for old Auth Helpers: createClientComponentClient, SessionContextProvider
// Removed SupabaseSession import if it's only used by SessionContextProvider
import { TaskRoutingProvider } from "../context/TaskRoutingContext";
import { FlowContextProvider } from "../context/FlowContext"; 
import { TeamSyncProvider } from "../context/TeamSyncContext";
// Assuming Database type is needed elsewhere or can be removed if not
// import { Database } from "../types/supabase"; 

interface ProvidersProps {
  children: ReactNode;
  // initialSession is no longer needed as context is handled by middleware + useSupabase hook
  teamId?: string;
}

export function Providers({
  children,
  teamId, // Removed initialSession from props
}: ProvidersProps) {
  // supabase client instance is now created and managed in supabaseClient.ts and useSupabase hook
  // const supabase = createClientComponentClient<Database>(); 

  // Remove SessionContextProvider wrapper
  return (
    <FlowContextProvider> 
      {/* Removed options prop */}
      <TaskRoutingProvider> 
        {teamId ? (
          <TeamSyncProvider teamId={teamId}>{children}</TeamSyncProvider>
        ) : (
          children
        )}
      </TaskRoutingProvider>
    </FlowContextProvider>
  );
}
