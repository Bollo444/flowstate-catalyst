export const MetricsExplorer: React.FC = () => {
  const { metrics, dimensions } = useMetricsData();

  return (
    <div className="metrics-explorer">
      <MetricsList metrics={metrics} />
      <DimensionSelector dimensions={dimensions} />
      <CustomViews />
    </div>
  );
};
