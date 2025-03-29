export const SystemHealth: React.FC = () => {
  const { status, diagnostics } = useSystemHealth();

  return (
    <div className="system-health">
      <HealthDashboard status={status} />
      <DiagnosticsPanel diagnostics={diagnostics} />
      <MaintenanceScheduler />
    </div>
  );
};
