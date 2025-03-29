export class LicenseDocumentation {
  private readonly licenses = new Map<string, LicenseDoc>();
  private readonly generator: DocGenerator;

  generateLicenseDoc(config: DocConfig): DocResult {
    const generated = this.processLicense(config);
    return this.generateDocReport(generated);
  }
}
