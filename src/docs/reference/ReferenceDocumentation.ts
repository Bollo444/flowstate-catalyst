export class ReferenceDocumentation {
  private readonly references = new Map<string, ReferenceDoc>();
  private readonly generator: DocGenerator;

  generateReferenceDoc(config: DocConfig): DocResult {
    const generated = this.processReference(config);
    return this.generateDocReport(generated);
  }
}
