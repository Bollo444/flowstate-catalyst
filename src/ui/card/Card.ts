export class Card {
  private readonly cardData = new Map<string, CardConfig>();
  private readonly manager: UIManager;

  renderCard(config: UIConfig): UIResult {
    const rendered = this.processCard(config);
    return this.generateCardReport(rendered);
  }
}
