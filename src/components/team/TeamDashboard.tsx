export const TeamDashboard: React.FC = () => {
  const { teamMetrics, teamGoals } = useTeamData();

  return (
    <div className="team-dashboard">
      <TeamMetrics metrics={teamMetrics} />
      <GoalTracking goals={teamGoals} />
      <TeamCalendar />
    </div>
  );
};
