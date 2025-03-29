export class ApiAuthorizationService {
  private readonly permissions = new Map<string, Permission>();
  private readonly authorizer: Authorizer;

  authorizeRequest(request: ApiRequest): AuthorizationResult {
    const authorized = this.checkPermissions(request);
    return this.generateAuthResponse(authorized);
  }
}
