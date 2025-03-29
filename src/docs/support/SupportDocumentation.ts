export class SupportDocumentation {
  private readonly resources = new Map<string, SupportDoc>();
  private readonly generator: DocGenerator;

  generateSupportDoc(config: DocConfig): DocResult {
    const generated = this.processSupport(config);
    return this.generateDocReport(generated);
  }
}
