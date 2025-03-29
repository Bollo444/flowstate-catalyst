export const Wizard: React.FC<WizardProps> = ({ steps, currentStep }) => {
  return (
    <div className="wizard-container">
      <WizardSteps steps={steps} />
      <WizardContent currentStep={currentStep} />
      <WizardNavigation />
    </div>
  );
};
