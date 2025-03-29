export class ConfigurationDocumentation {
  private readonly settings = new Map<string, ConfigDoc>();
  private readonly generator: DocGenerator;

  generateConfigurationDoc(config: DocConfig): DocResult {
    const generated = this.processConfiguration(config);
    return this.generateDocReport(generated);
  }
}
