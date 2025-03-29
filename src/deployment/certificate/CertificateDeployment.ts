export class CertificateDeployment {
  private readonly certificates = new Map<string, CertificateConfig>();
  private readonly manager: DeploymentManager;

  deployCertificate(config: DeployConfig): DeployResult {
    const deployed = this.processCertificate(config);
    return this.generateDeployReport(deployed);
  }
}
