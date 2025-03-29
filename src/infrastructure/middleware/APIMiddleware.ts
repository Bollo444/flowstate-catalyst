export class APIMiddleware {
  private readonly middleware = new Map<string, MiddlewareConfig>();
  private readonly manager: InfrastructureManager;

  configureMiddleware(options: ConfigOptions): ConfigResult {
    const configured = this.processConfig(options);
    return this.generateConfigReport(configured);
  }
}
