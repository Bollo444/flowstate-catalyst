export const LoadingSpinner: React.FC<SpinnerProps> = ({ size, color }) => {
  return (
    <div className={`spinner-${size} text-${color}`}>
      <SpinnerAnimation />
      <SpinnerOverlay />
    </div>
  );
};
