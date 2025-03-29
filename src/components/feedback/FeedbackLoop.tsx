export const FeedbackLoop: React.FC = () => {
  const { feedback, metrics } = useFeedbackSystem();

  return (
    <div className="feedback-loop">
      <FeedbackCollector feedback={feedback} />
      <MetricsAnalyzer metrics={metrics} />
      <ImprovementSuggestions />
    </div>
  );
};
