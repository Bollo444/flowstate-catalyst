export class PrivacyDocumentation {
  private readonly policies = new Map<string, PrivacyDoc>();
  private readonly generator: DocGenerator;

  generatePrivacyDoc(config: DocConfig): DocResult {
    const generated = this.processPrivacy(config);
    return this.generateDocReport(generated);
  }
}
