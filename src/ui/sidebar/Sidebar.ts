export class Sidebar {
  private readonly sidebarItems = new Map<string, SidebarConfig>();
  private readonly manager: UIManager;

  renderSidebar(config: UIConfig): UIResult {
    const rendered = this.processSidebar(config);
    return this.generateSidebarReport(rendered);
  }
}
