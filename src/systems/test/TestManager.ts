export class TestManager {
  private readonly tests = new Map<string, TestConfig>();
  private readonly system: SystemManager;

  manageTest(config: SystemConfig): SystemResult {
    const managed = this.processTest(config);
    return this.generateTestReport(managed);
  }
}
