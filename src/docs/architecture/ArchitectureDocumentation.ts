export class ArchitectureDocumentation {
  private readonly diagrams = new Map<string, ArchitectureDoc>();
  private readonly generator: DocGenerator;

  generateArchitectureDoc(config: DocConfig): DocResult {
    const generated = this.processArchitecture(config);
    return this.generateDocReport(generated);
  }
}
