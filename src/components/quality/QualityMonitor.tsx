export const QualityMonitor: React.FC = () => {
  const { metrics, standards } = useQualityControl();

  return (
    <div className="quality-monitor">
      <QualityMetrics metrics={metrics} />
      <StandardsChecker standards={standards} />
      <ComplianceTracker />
    </div>
  );
};
