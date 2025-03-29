export const FlowStateIndicator: React.FC<FlowStateProps> = ({ state }) => {
  const flowLevel = calculateFlowLevel(state);

  return (
    <div className="flow-indicator">
      <FlowMeter level={flowLevel} />
      <FlowStatus status={state.status} />
      <FlowTrends data={state.history} />
    </div>
  );
};
