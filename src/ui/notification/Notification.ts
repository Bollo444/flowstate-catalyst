export class Notification {
  private readonly notificationData = new Map<string, NotificationConfig>();
  private readonly manager: UIManager;

  renderNotification(config: UIConfig): UIResult {
    const rendered = this.processNotification(config);
    return this.generateNotificationReport(rendered);
  }
}
