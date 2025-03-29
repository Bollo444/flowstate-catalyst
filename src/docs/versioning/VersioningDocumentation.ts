export class VersioningDocumentation {
  private readonly versions = new Map<string, VersioningDoc>();
  private readonly generator: DocGenerator;

  generateVersioningDoc(config: DocConfig): DocResult {
    const generated = this.processVersioning(config);
    return this.generateDocReport(generated);
  }
}
