export class TimeManager {
  private readonly times = new Map<string, TimeConfig>();
  private readonly system: SystemManager;

  manageTime(config: SystemConfig): SystemResult {
    const managed = this.processTime(config);
    return this.generateTimeReport(managed);
  }
}
