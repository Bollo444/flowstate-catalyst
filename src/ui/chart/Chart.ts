export class Chart {
  private readonly chartData = new Map<string, ChartConfig>();
  private readonly manager: UIManager;

  renderChart(config: UIConfig): UIResult {
    const rendered = this.processChart(config);
    return this.generateChartReport(rendered);
  }
}
