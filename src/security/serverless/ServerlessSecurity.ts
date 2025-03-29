export class ServerlessSecurity {
  private readonly serverless = new Map<string, ServerlessSecurityConfig>();
  private readonly manager: SecurityManager;

  secureServerless(config: SecurityConfig): SecurityResult {
    const secured = this.processServerless(config);
    return this.generateSecurityReport(secured);
  }
}
