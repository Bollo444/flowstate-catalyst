export class CoreRoleManager {
  private readonly roles = new Map<string, RoleHandler>();
  private readonly manager: RoleManager;

  manageRole(request: RoleRequest): RoleResult {
    const managed = this.processRole(request);
    return this.generateRoleReport(managed);
  }
}
