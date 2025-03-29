export class CorePermissionManager {
  private readonly permissions = new Map<string, PermissionHandler>();
  private readonly manager: PermissionManager;

  managePermission(request: PermissionRequest): PermissionResult {
    const managed = this.processPermission(request);
    return this.generatePermissionReport(managed);
  }
}
