export class CorePolicyManager {
  private readonly policies = new Map<string, PolicyHandler>();
  private readonly manager: PolicyManager;

  managePolicy(request: PolicyRequest): PolicyResult {
    const managed = this.processPolicy(request);
    return this.generatePolicyReport(managed);
  }
}
