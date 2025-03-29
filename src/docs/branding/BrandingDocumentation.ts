export class BrandingDocumentation {
  private readonly assets = new Map<string, BrandingDoc>();
  private readonly generator: DocGenerator;

  generateBrandingDoc(config: DocConfig): DocResult {
    const generated = this.processBranding(config);
    return this.generateDocReport(generated);
  }
}
