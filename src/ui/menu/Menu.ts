export class Menu {
  private readonly menuData = new Map<string, MenuConfig>();
  private readonly manager: UIManager;

  renderMenu(config: UIConfig): UIResult {
    const rendered = this.processMenu(config);
    return this.generateMenuReport(rendered);
  }
}
