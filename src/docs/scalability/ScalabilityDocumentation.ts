export class ScalabilityDocumentation {
  private readonly strategies = new Map<string, ScalabilityDoc>();
  private readonly generator: DocGenerator;

  generateScalabilityDoc(config: DocConfig): DocResult {
    const generated = this.processScalability(config);
    return this.generateDocReport(generated);
  }
}
