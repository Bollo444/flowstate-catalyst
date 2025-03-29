export class ApiSecurityService {
  private readonly securityRules = new Map<string, SecurityRule>();
  private readonly engine: SecurityEngine;

  securePath(path: string, rules: SecurityRules): SecurityConfig {
    const security = this.applySecurity(path, rules);
    return this.generateSecurityConfig(security);
  }
}
