export class Dialog {
  private readonly dialogData = new Map<string, DialogConfig>();
  private readonly manager: UIManager;

  renderDialog(config: UIConfig): UIResult {
    const rendered = this.processDialog(config);
    return this.generateDialogReport(rendered);
  }
}
