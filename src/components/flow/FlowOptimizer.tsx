export const FlowOptimizer: React.FC = () => {
  const { settings, optimizations } = useFlowOptimization();

  return (
    <div className="flow-optimizer">
      <OptimizationSettings settings={settings} />
      <SuggestionEngine optimizations={optimizations} />
      <ImpactAnalysis />
    </div>
  );
};
