export const IntegrationHub: React.FC = () => {
  const { integrations, status } = useIntegrations();

  return (
    <div className="integration-hub">
      <IntegrationList integrations={integrations} />
      <ConnectionStatus status={status} />
      <SetupWizard />
    </div>
  );
};
