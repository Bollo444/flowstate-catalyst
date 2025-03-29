"use client";

import React from "react";
import { useFlowContext } from "@/context/FlowContext";
import { useTeam } from "@/hooks/useTeam";
import TeamCharter from "@/features/TeamCharter";
import TeamFlowSync from "@/components/team/TeamFlowSync";

const TeamPage = () => {
  const { flowState } = useFlowContext();
  const { team, loading } = useTeam();

  if (loading) {
    return (
      <div className="p-6">
        <div className="animate-pulse bg-gray-700/20 rounded-lg h-96" />
      </div>
    );
  }

  if (!team) {
    return (
      <div className="p-6">
        <div className="text-center py-12">
          <h3 className="text-lg font-medium text-gray-400">No Team Found</h3>
          <p className="mt-2 text-sm text-gray-500">
            Join or create a team to see flow synchronization
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 space-y-8">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <TeamCharter />
        {flowState && (
          <TeamFlowSync teamId={team.id} currentUserId={flowState.userId} />
        )}
      </div>
    </div>
  );
};

export default TeamPage;
