export class DeploymentDocumentation {
  private readonly steps = new Map<string, DeploymentDoc>();
  private readonly generator: DocGenerator;

  generateDeploymentDoc(config: DocConfig): DocResult {
    const generated = this.processDeployment(config);
    return this.generateDocReport(generated);
  }
}
