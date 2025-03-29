export class CoreAuthManager {
  private readonly authenticators = new Map<string, AuthHandler>();
  private readonly manager: AuthManager;

  authenticate(request: AuthRequest): AuthResult {
    const authenticated = this.processAuth(request);
    return this.generateAuthReport(authenticated);
  }
}
