export class APIDocumentation {
  private readonly endpoints = new Map<string, EndpointDoc>();
  private readonly generator: DocGenerator;

  generateAPIDoc(config: DocConfig): DocResult {
    const generated = this.processAPI(config);
    return this.generateDocReport(generated);
  }
}
