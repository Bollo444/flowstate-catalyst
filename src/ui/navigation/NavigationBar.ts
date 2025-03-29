export class NavigationBar {
  private readonly navItems = new Map<string, NavConfig>();
  private readonly manager: UIManager;

  renderNavigation(config: UIConfig): UIResult {
    const rendered = this.processNavigation(config);
    return this.generateNavReport(rendered);
  }
}
