export class OpenIDSecurity {
  private readonly openids = new Map<string, OpenIDConfig>();
  private readonly manager: SecurityManager;

  secureOpenID(config: SecurityConfig): SecurityResult {
    const secured = this.processOpenID(config);
    return this.generateSecurityReport(secured);
  }
}
