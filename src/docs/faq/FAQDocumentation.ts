export class FAQDocumentation {
  private readonly questions = new Map<string, FAQDoc>();
  private readonly generator: DocGenerator;

  generateFAQDoc(config: DocConfig): DocResult {
    const generated = this.processFAQ(config);
    return this.generateDocReport(generated);
  }
}
