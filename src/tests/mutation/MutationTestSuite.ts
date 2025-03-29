export class MutationTestSuite {
  private readonly tests = new Map<string, TestCase>();
  private readonly runner: TestRunner;

  runMutationTests(config: TestConfig): TestResult {
    const executed = this.executeTests(config);
    return this.generateTestReport(executed);
  }
}
