export class Button {
  private readonly buttonData = new Map<string, ButtonConfig>();
  private readonly manager: UIManager;

  renderButton(config: UIConfig): UIResult {
    const rendered = this.processButton(config);
    return this.generateButtonReport(rendered);
  }
}
