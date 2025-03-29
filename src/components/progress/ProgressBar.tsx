export const ProgressBar: React.FC<ProgressProps> = ({
  value,
  total,
  type,
}) => {
  return (
    <div className="relative pt-1">
      <ProgressTrack value={value} total={total} />
      <ProgressIndicator type={type} />
      <ProgressLabel value={value} total={total} />
    </div>
  );
};
