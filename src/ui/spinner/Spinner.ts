export class Spinner {
  private readonly spinnerData = new Map<string, SpinnerConfig>();
  private readonly manager: UIManager;

  renderSpinner(config: UIConfig): UIResult {
    const rendered = this.processSpinner(config);
    return this.generateSpinnerReport(rendered);
  }
}
