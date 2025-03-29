export class DataTable {
  private readonly tableData = new Map<string, TableConfig>();
  private readonly manager: UIManager;

  renderTable(config: UIConfig): UIResult {
    const rendered = this.processTable(config);
    return this.generateTableReport(rendered);
  }
}
