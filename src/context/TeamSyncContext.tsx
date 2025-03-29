"use client";

import { createContext, useContext, ReactNode } from "react";
import {
  useTeamFlowSync,
  UseTeamFlowSyncResult,
} from "../hooks/useTeamFlowSync";

const TeamSyncContext = createContext<UseTeamFlowSyncResult | null>(null);

export function useTeamSync() {
  const context = useContext(TeamSyncContext);
  if (!context) {
    throw new Error("useTeamSync must be used within a TeamSyncProvider");
  }
  return context;
}

interface TeamSyncProviderProps {
  children: ReactNode;
  teamId: string;
}

export function TeamSyncProvider({ children, teamId }: TeamSyncProviderProps) {
  const syncState = useTeamFlowSync(teamId);

  return (
    <TeamSyncContext.Provider value={syncState}>
      {children}
    </TeamSyncContext.Provider>
  );
}
