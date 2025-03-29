export class Tabs {
  private readonly tabsData = new Map<string, TabsConfig>();
  private readonly manager: UIManager;

  renderTabs(config: UIConfig): UIResult {
    const rendered = this.processTabs(config);
    return this.generateTabsReport(rendered);
  }
}
