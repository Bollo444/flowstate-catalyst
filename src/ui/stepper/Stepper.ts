export class Stepper {
  private readonly stepperData = new Map<string, StepperConfig>();
  private readonly manager: UIManager;

  renderStepper(config: UIConfig): UIResult {
    const rendered = this.processStepper(config);
    return this.generateStepperReport(rendered);
  }
}
