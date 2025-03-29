export class ExampleDocumentation {
  private readonly examples = new Map<string, ExampleDoc>();
  private readonly generator: DocGenerator;

  generateExampleDoc(config: DocConfig): DocResult {
    const generated = this.processExample(config);
    return this.generateDocReport(generated);
  }
}
