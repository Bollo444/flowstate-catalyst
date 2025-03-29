export class ServiceMeshInfra {
  private readonly mesh = new Map<string, MeshConfig>();
  private readonly manager: InfrastructureManager;

  configureMesh(options: ConfigOptions): ConfigResult {
    const configured = this.processConfig(options);
    return this.generateConfigReport(configured);
  }
}
