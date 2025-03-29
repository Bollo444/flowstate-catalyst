export class ErrorDocumentation {
  private readonly errors = new Map<string, ErrorDoc>();
  private readonly generator: DocGenerator;

  generateErrorDoc(config: DocConfig): DocResult {
    const generated = this.processError(config);
    return this.generateDocReport(generated);
  }
}
