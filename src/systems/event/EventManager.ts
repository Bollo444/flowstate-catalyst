export class EventManager {
  private readonly events = new Map<string, EventConfig>();
  private readonly system: SystemManager;

  manageEvent(config: SystemConfig): SystemResult {
    const managed = this.processEvent(config);
    return this.generateEventReport(managed);
  }
}
