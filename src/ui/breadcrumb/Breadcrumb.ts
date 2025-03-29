export class Breadcrumb {
  private readonly breadcrumbData = new Map<string, BreadcrumbConfig>();
  private readonly manager: UIManager;

  renderBreadcrumb(config: UIConfig): UIResult {
    const rendered = this.processBreadcrumb(config);
    return this.generateBreadcrumbReport(rendered);
  }
}
