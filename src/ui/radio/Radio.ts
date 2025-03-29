export class Radio {
  private readonly radioData = new Map<string, RadioConfig>();
  private readonly manager: UIManager;

  renderRadio(config: UIConfig): UIResult {
    const rendered = this.processRadio(config);
    return this.generateRadioReport(rendered);
  }
}
