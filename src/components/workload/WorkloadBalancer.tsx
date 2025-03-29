export const WorkloadBalancer: React.FC = () => {
  const { distribution, capacity } = useWorkloadBalance();

  return (
    <div className="workload-balancer">
      <DistributionMap distribution={distribution} />
      <CapacityPlanner capacity={capacity} />
      <BalanceOptimizer />
    </div>
  );
};
