export class DataGrid {
  private readonly gridData = new Map<string, GridConfig>();
  private readonly manager: UIManager;

  renderGrid(config: UIConfig): UIResult {
    const rendered = this.processGrid(config);
    return this.generateGridReport(rendered);
  }
}
