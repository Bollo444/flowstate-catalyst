export class Alert {
  private readonly alertData = new Map<string, AlertConfig>();
  private readonly manager: UIManager;

  renderAlert(config: UIConfig): UIResult {
    const rendered = this.processAlert(config);
    return this.generateAlertReport(rendered);
  }
}
