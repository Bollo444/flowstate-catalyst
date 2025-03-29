export class CoreSessionManager {
  private readonly sessions = new Map<string, SessionHandler>();
  private readonly manager: SessionManager;

  manageSession(request: SessionRequest): SessionResult {
    const managed = this.processSession(request);
    return this.generateSessionReport(managed);
  }
}
