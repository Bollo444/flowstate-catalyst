export const FlowTrends: React.FC<FlowTrendsProps> = ({ data }) => {
  const trends = analyzeTrends(data);

  return (
    <div className="flow-trends">
      <TrendChart data={trends} />
      <TrendAnalysis analysis={trends.analysis} />
      <TrendFilters />
    </div>
  );
};
