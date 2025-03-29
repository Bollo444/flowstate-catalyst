export class EventTestSuite {
  private readonly tests = new Map<string, TestCase>();
  private readonly runner: TestRunner;

  runEventTests(config: TestConfig): TestResult {
    const executed = this.executeTests(config);
    return this.generateTestReport(executed);
  }
}
