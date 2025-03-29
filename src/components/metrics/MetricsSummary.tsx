export const MetricsSummary: React.FC<SummaryProps> = ({ summary }) => {
  const insights = generateInsights(summary);

  return (
    <div className="metrics-summary">
      <SummaryStats stats={summary.stats} />
      <SummaryInsights insights={insights} />
      <SummaryActions />
    </div>
  );
};
