export const ProcessAutomator: React.FC = () => {
  const { processes, automations } = useProcessAutomation();

  return (
    <div className="process-automator">
      <ProcessMapper processes={processes} />
      <AutomationBuilder automations={automations} />
      <EfficiencyTracker />
    </div>
  );
};
