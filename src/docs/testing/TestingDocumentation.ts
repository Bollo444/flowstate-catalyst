export class TestingDocumentation {
  private readonly suites = new Map<string, TestDoc>();
  private readonly generator: DocGenerator;

  generateTestingDoc(config: DocConfig): DocResult {
    const generated = this.processTesting(config);
    return this.generateDocReport(generated);
  }
}
