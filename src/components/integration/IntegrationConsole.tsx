export const IntegrationConsole: React.FC = () => {
  const { connections, services } = useIntegrationSystem();

  return (
    <div className="integration-console">
      <ConnectionManager connections={connections} />
      <ServiceDirectory services={services} />
      <MonitoringTools />
    </div>
  );
};
