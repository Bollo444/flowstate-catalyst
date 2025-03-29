export class Header {
  private readonly headerItems = new Map<string, HeaderConfig>();
  private readonly manager: UIManager;

  renderHeader(config: UIConfig): UIResult {
    const rendered = this.processHeader(config);
    return this.generateHeaderReport(rendered);
  }
}
