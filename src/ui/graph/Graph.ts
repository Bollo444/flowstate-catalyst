export class Graph {
  private readonly graphData = new Map<string, GraphConfig>();
  private readonly manager: UIManager;

  renderGraph(config: UIConfig): UIResult {
    const rendered = this.processGraph(config);
    return this.generateGraphReport(rendered);
  }
}
