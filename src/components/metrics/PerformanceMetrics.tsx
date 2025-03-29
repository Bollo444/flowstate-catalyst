export const PerformanceMetrics: React.FC<MetricsProps> = ({ data }) => {
  const metrics = processMetrics(data);

  return (
    <div className="performance-metrics">
      <MetricsChart data={metrics.chart} />
      <MetricsSummary summary={metrics.summary} />
      <MetricsControls />
    </div>
  );
};
