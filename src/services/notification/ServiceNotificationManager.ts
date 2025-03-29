export class ServiceNotificationManager {
  private readonly notifiers = new Map<string, NotificationHandler>();
  private readonly manager: NotificationManager;

  manageNotification(request: NotificationRequest): NotificationResult {
    const managed = this.processNotification(request);
    return this.generateNotificationReport(managed);
  }
}
