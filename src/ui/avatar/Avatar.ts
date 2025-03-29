export class Avatar {
  private readonly avatarData = new Map<string, AvatarConfig>();
  private readonly manager: UIManager;

  renderAvatar(config: UIConfig): UIResult {
    const rendered = this.processAvatar(config);
    return this.generateAvatarReport(rendered);
  }
}
