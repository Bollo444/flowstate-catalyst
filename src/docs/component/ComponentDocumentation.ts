export class ComponentDocumentation {
  private readonly components = new Map<string, ComponentDoc>();
  private readonly generator: DocGenerator;

  generateComponentDoc(config: DocConfig): DocResult {
    const generated = this.processComponent(config);
    return this.generateDocReport(generated);
  }
}
