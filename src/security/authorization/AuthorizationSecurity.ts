export class AuthorizationSecurity {
  private readonly authorizers = new Map<string, AuthzConfig>();
  private readonly manager: SecurityManager;

  secureAuthorization(config: SecurityConfig): SecurityResult {
    const secured = this.processAuthorization(config);
    return this.generateSecurityReport(secured);
  }
}
