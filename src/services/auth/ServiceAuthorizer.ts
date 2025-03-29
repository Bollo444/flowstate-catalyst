export class ServiceAuthorizer {
  private readonly authorizers = new Map<string, Authorizer>();
  private readonly manager: AuthorizationManager;

  authorize(request: AuthorizationRequest): AuthorizationResult {
    const authorized = this.processAuthorization(request);
    return this.generateAuthorizationReport(authorized);
  }
}
