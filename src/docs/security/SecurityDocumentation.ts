export class SecurityDocumentation {
  private readonly policies = new Map<string, SecurityDoc>();
  private readonly generator: DocGenerator;

  generateSecurityDoc(config: DocConfig): DocResult {
    const generated = this.processSecurity(config);
    return this.generateDocReport(generated);
  }
}
