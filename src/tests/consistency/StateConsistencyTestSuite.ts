export class StateConsistencyTestSuite {
  private readonly tests = new Map<string, TestCase>();
  private readonly runner: TestRunner;

  runStateConsistencyTests(config: TestConfig): TestResult {
    const executed = this.executeTests(config);
    return this.generateTestReport(executed);
  }
}
