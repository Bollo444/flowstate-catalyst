export class CorePersistenceManager {
  private readonly persisters = new Map<string, PersistenceHandler>();
  private readonly manager: PersistenceManager;

  managePersistence(request: PersistenceRequest): PersistenceResult {
    const managed = this.processPersistence(request);
    return this.generatePersistenceReport(managed);
  }
}
