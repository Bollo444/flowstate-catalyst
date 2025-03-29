export class MarkdownEditor {
  private readonly markdownData = new Map<string, MarkdownConfig>();
  private readonly manager: UIManager;

  renderMarkdown(config: UIConfig): UIResult {
    const rendered = this.processMarkdown(config);
    return this.generateMarkdownReport(rendered);
  }
}
