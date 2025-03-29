export const StatusIndicator: React.FC<StatusProps> = ({
  status,
  size,
  label,
}) => {
  return (
    <div className={`status-indicator ${status} ${size}`}>
      <StatusIcon status={status} />
      <StatusLabel label={label} />
    </div>
  );
};
