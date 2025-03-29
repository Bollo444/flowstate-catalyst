export class Dropdown {
  private readonly dropdownData = new Map<string, DropdownConfig>();
  private readonly manager: UIManager;

  renderDropdown(config: UIConfig): UIResult {
    const rendered = this.processDropdown(config);
    return this.generateDropdownReport(rendered);
  }
}
