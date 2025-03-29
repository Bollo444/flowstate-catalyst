export class Input {
  private readonly inputData = new Map<string, InputConfig>();
  private readonly manager: UIManager;

  renderInput(config: UIConfig): UIResult {
    const rendered = this.processInput(config);
    return this.generateInputReport(rendered);
  }
}
