export class Checkbox {
  private readonly checkboxData = new Map<string, CheckboxConfig>();
  private readonly manager: UIManager;

  renderCheckbox(config: UIConfig): UIResult {
    const rendered = this.processCheckbox(config);
    return this.generateCheckboxReport(rendered);
  }
}
