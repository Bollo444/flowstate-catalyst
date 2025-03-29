export class Form {
  private readonly formData = new Map<string, FormConfig>();
  private readonly manager: UIManager;

  renderForm(config: UIConfig): UIResult {
    const rendered = this.processForm(config);
    return this.generateFormReport(rendered);
  }
}
