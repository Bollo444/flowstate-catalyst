export class SearchTestSuite {
  private readonly tests = new Map<string, TestCase>();
  private readonly runner: TestRunner;

  runSearchTests(config: TestConfig): TestResult {
    const executed = this.executeTests(config);
    return this.generateTestReport(executed);
  }
}
