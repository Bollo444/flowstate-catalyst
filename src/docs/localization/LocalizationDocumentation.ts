export class LocalizationDocumentation {
  private readonly translations = new Map<string, LocalizationDoc>();
  private readonly generator: DocGenerator;

  generateLocalizationDoc(config: DocConfig): DocResult {
    const generated = this.processLocalization(config);
    return this.generateDocReport(generated);
  }
}
