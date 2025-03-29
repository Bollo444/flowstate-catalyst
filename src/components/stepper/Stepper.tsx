export const Stepper: React.FC<StepperProps> = ({ steps, currentStep }) => {
  return (
    <div className="stepper-container">
      <StepperProgress steps={steps} />
      <StepperContent currentStep={currentStep} />
    </div>
  );
};
