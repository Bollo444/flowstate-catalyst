export class Badge {
  private readonly badgeData = new Map<string, BadgeConfig>();
  private readonly manager: UIManager;

  renderBadge(config: UIConfig): UIResult {
    const rendered = this.processBadge(config);
    return this.generateBadgeReport(rendered);
  }
}
