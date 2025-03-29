export const InsightGenerator: React.FC = () => {
  const { data, patterns } = useInsightAnalysis();

  return (
    <div className="insight-generator">
      <PatternAnalyzer data={data} />
      <InsightVisualizer patterns={patterns} />
      <RecommendationEngine />
    </div>
  );
};
