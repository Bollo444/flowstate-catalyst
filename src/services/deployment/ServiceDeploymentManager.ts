export class ServiceDeploymentManager {
  private readonly deployers = new Map<string, DeploymentHandler>();
  private readonly manager: DeploymentManager;

  manageDeploy(request: DeployRequest): DeployResult {
    const managed = this.processDeploy(request);
    return this.generateDeployReport(managed);
  }
}
