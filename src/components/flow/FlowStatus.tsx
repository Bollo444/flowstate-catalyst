export const FlowStatus: React.FC<FlowStatusProps> = ({ status }) => {
  const statusInfo = getStatusInfo(status);

  return (
    <div className="flow-status">
      <StatusIndicator type={status.type} />
      <StatusDetails info={statusInfo} />
      <StatusActions />
    </div>
  );
};
