// src/components/dashboard/DashboardLayout.tsx
import React from "react";
import { DashboardControls } from "./DashboardControls";
import { TeamInsights } from "./TeamInsights";
import { ActivityFeed } from "../team/ActivityFeed";
import { TeamMembers } from "../team/TeamMembers";
import { QuickActions } from "./QuickActions";
import { useTeamDashboard } from "@/hooks/useTeamDashboard"; // Corrected path
import { useFlowContext } from "@/context/FlowContext"; // Import Flow context
import { FlowState, ActivityMetrics } from "@/types/flow"; // Import needed types
import { useTeamMembers } from "@/hooks/useTeamMembers"; // Placeholder hook for team members
import { FlowStateIndicator } from "../flow/FlowStateIndicator";

interface DashboardLayoutProps {
  teamId: string;
}

export const DashboardLayout: React.FC<DashboardLayoutProps> = ({ teamId }) => {
  const { state, updateDashboardState } = useTeamDashboard();
  const { flowState } = useFlowContext(); // Get flowState from context
  // Assume useTeamMembers hook provides members, loading state, and error state
  const { members, loading: membersLoading, error: membersError } = useTeamMembers(teamId); // Placeholder hook call

  // Define metrics based on flowState (similar to FlowStateApp)
  // Ensure default values if flowState is initially null/undefined
  const metrics: ActivityMetrics = {
    activeTime: flowState?.activeTime ?? 0, // Available on FlowState
    taskCompletions: 0, // Corrected: Not on flowState object from context
    contextSwitches: 0, // Not on FlowState, default to 0
    dayProgress: new Date().getHours() / 24,
    interruptions: 0, // Corrected: Not on flowState object from context
    interruptedTime: 0, // Not on FlowState, default to 0
  };

  // Define a placeholder interrupt handler
  const handleInterrupt = () => {
    console.log("Interrupt recorded from DashboardLayout");
    // TODO: Implement actual interruption logic (e.g., update context, API call)
  };

  // Guard against rendering if flowState is not yet available
  if (!flowState) {
    // Optionally return a loading indicator or null
    // Consider if DashboardLayout should *always* have flowState or handle its absence gracefully
    return null; // Or <LoadingSpinner />;
  }

  // Main layout container: full height, flex column
  return (
    <div className="flex flex-col min-h-screen bg-background-light dark:bg-background-dark">
      {/* Header: Sticky top, uses h-16 from Header.tsx, padding, flex layout, background and border from theme */}
      <header className="sticky top-0 z-10 flex items-center justify-between p-4 h-16 bg-background-light dark:bg-background-dark border-b border-border-light dark:border-border-dark">
        <FlowStateIndicator
          flowState={flowState}
          metrics={metrics}
          onInterrupt={handleInterrupt}
        />
        <DashboardControls />
      </header>

      {/* Main Content Area: Grid layout (responsive), gap, padding */}
      {/* Adjusted padding to p-8, gap to gap-8 */}
      <div className="flex-1 grid grid-cols-1 lg:grid-cols-[3fr_1fr] gap-8 p-8 overflow-hidden">
        {/* Primary Section (Left): Flex column, gap, scrollable */}
        {/* Added pr-4 for scrollbar spacing */}
        <div className="flex flex-col gap-8 overflow-y-auto pr-4">
          <TeamInsights
            // Consider adding loading/error handling for TeamInsights based on its hook
            teamId={teamId}
            timeframe={state.timeframe}
            selectedMetrics={state.selectedMetrics}
          />
          <ActivityFeed />
        </div>

        {/* Sidebar (Right): Static on large screens (lg), flex column, gap, themed background, padding, rounded */}
        {/* Adjusted sticky top to account for header height (h-16 = 4rem) + padding (p-8 = 2rem * 2?) Let's use 6rem for now */}
        {/* Added dark:bg-background-dark-secondary */}
        {/* Conditionally render TeamMembers or loading/error state */}
        <aside className="lg:sticky lg:top-[6rem] flex flex-col gap-8 p-6 bg-background-light-secondary dark:bg-background-dark rounded-lg h-fit">
          {membersLoading ? (
             <div>Loading members...</div>
          ) : membersError ? (
             <div className="text-error-light dark:text-error-dark">Error loading members</div>
          ) : (
             <TeamMembers teamId={teamId} members={members || []} />
          )}
          <QuickActions
            onActionComplete={() =>
              updateDashboardState({
                lastUpdate: new Date(),
              })
            }
          />
        </aside>
      </div>
    </div>
  );
};
