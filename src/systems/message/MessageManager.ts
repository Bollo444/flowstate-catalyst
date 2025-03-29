export class MessageManager {
  private readonly messages = new Map<string, MessageConfig>();
  private readonly system: SystemManager;

  manageMessage(config: SystemConfig): SystemResult {
    const managed = this.processMessage(config);
    return this.generateMessageReport(managed);
  }
}
