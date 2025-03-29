export class Progress {
  private readonly progressData = new Map<string, ProgressConfig>();
  private readonly manager: UIManager;

  renderProgress(config: UIConfig): UIResult {
    const rendered = this.processProgress(config);
    return this.generateProgressReport(rendered);
  }
}
