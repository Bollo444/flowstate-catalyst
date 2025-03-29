export class ServiceAuthenticator {
  private readonly authenticators = new Map<string, Authenticator>();
  private readonly manager: AuthManager;

  authenticate(request: AuthRequest): AuthResult {
    const authenticated = this.processAuthentication(request);
    return this.generateAuthReport(authenticated);
  }
}
