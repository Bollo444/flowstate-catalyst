export class APITestSuite {
  private readonly tests = new Map<string, TestCase>();
  private readonly runner: TestRunner;

  runAPITests(config: TestConfig): TestResult {
    const executed = this.executeTests(config);
    return this.generateTestReport(executed);
  }
}
