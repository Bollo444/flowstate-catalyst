export class IntegrationDocumentation {
  private readonly integrations = new Map<string, IntegrationDoc>();
  private readonly generator: DocGenerator;

  generateIntegrationDoc(config: DocConfig): DocResult {
    const generated = this.processIntegration(config);
    return this.generateDocReport(generated);
  }
}
