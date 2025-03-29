export class ServiceAlertManager {
  private readonly alerts = new Map<string, AlertHandler>();
  private readonly manager: AlertManager;

  manageAlert(request: AlertRequest): AlertResult {
    const managed = this.processAlert(request);
    return this.generateAlertReport(managed);
  }
}
