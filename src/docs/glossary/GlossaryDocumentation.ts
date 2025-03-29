export class GlossaryDocumentation {
  private readonly terms = new Map<string, GlossaryDoc>();
  private readonly generator: DocGenerator;

  generateGlossaryDoc(config: DocConfig): DocResult {
    const generated = this.processGlossary(config);
    return this.generateDocReport(generated);
  }
}
