export class Select {
  private readonly selectData = new Map<string, SelectConfig>();
  private readonly manager: UIManager;

  renderSelect(config: UIConfig): UIResult {
    const rendered = this.processSelect(config);
    return this.generateSelectReport(rendered);
  }
}
