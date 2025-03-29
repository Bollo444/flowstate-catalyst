export const ResourceOptimizer: React.FC = () => {
  const { resources, allocation } = useResourceOptimization();

  return (
    <div className="resource-optimizer">
      <AllocationMatrix resources={resources} />
      <EfficiencyMetrics allocation={allocation} />
      <OptimizationControls />
    </div>
  );
};
