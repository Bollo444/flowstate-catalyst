export class CoreHashManager {
  private readonly hashers = new Map<string, HashHandler>();
  private readonly manager: HashManager;

  manageHash(request: HashRequest): HashResult {
    const managed = this.processHash(request);
    return this.generateHashReport(managed);
  }
}
