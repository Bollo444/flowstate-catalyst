export const PerformanceDashboard: React.FC = () => {
  const { metrics, trends } = usePerformanceData();

  return (
    <div className="performance-dashboard">
      <MetricsOverview metrics={metrics} />
      <TrendAnalysis trends={trends} />
      <OptimizationSuggestions />
    </div>
  );
};
