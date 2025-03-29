export const TeamAnalytics: React.FC = () => {
  const { performance, collaboration } = useTeamAnalytics();

  return (
    <div className="team-analytics">
      <PerformanceMetrics performance={performance} />
      <CollaborationInsights collaboration={collaboration} />
      <TeamRecommendations />
    </div>
  );
};
