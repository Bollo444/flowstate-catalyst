export class List {
  private readonly listData = new Map<string, ListConfig>();
  private readonly manager: UIManager;

  renderList(config: UIConfig): UIResult {
    const rendered = this.processList(config);
    return this.generateListReport(rendered);
  }
}
