export class WebSecurity {
  private readonly webs = new Map<string, WebSecurityConfig>();
  private readonly manager: SecurityManager;

  secureWeb(config: SecurityConfig): SecurityResult {
    const secured = this.processWeb(config);
    return this.generateSecurityReport(secured);
  }
}
