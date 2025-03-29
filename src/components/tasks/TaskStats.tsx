export const TaskStats: React.FC = () => {
  const stats = useTaskStats();

  return (
    <div className="task-stats">
      <StatsOverview data={stats} />
      <StatsChart />
      <StatsDetails />
    </div>
  );
};
