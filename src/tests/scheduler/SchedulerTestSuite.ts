export class SchedulerTestSuite {
  private readonly tests = new Map<string, TestCase>();
  private readonly runner: TestRunner;

  runSchedulerTests(config: TestConfig): TestResult {
    const executed = this.executeTests(config);
    return this.generateTestReport(executed);
  }
}
