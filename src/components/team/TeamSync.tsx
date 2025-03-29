"use client";

import React from "react";
import styles from "./TeamSync.module.css";

interface TeamMember {
  id: string;
  name: string;
  role: string;
  status: string;
}

interface TeamSyncProps {
  members: TeamMember[];
}

export const TeamSync: React.FC = () => {
  const { team, syncStatus } = useTeamSync();

  return (
    <div className="team-sync">
      <TeamMembers members={team} />
      <SyncStatus status={syncStatus} />
      <CollaborationTools />
    </div>
  );
};
export default TeamSync;
