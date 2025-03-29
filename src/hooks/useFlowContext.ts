export function useFlowContext() {
  const { flowState, metrics } = useFlowState();
  const { syncState, teamMembers } = useTeamSync();
  const { schedule } = useFlowOptimization();
  const { analytics } = useFlowAnalytics();

  const contextValue = useMemo(
    () => ({
      flowState,
      metrics,
      teamState: {
        members: teamMembers,
        sync: syncState,
        schedule,
      },
      insights: {
        analytics,
        recommendations: schedule.suggestions,
        predictions: schedule.predictions,
      },
    }),
    [flowState, metrics, teamMembers, syncState, schedule, analytics]
  );

  return contextValue;
}
