export class CoreTokenManager {
  private readonly tokens = new Map<string, TokenHandler>();
  private readonly manager: TokenManager;

  manageToken(request: TokenRequest): TokenResult {
    const managed = this.processToken(request);
    return this.generateTokenReport(managed);
  }
}
