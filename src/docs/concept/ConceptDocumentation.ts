export class ConceptDocumentation {
  private readonly concepts = new Map<string, ConceptDoc>();
  private readonly generator: DocGenerator;

  generateConceptDoc(config: DocConfig): DocResult {
    const generated = this.processConcept(config);
    return this.generateDocReport(generated);
  }
}
