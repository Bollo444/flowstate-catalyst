export class ServiceMigrationManager {
  private readonly migrations = new Map<string, MigrationHandler>();
  private readonly manager: MigrationManager;

  manageMigration(request: MigrationRequest): MigrationResult {
    const managed = this.processMigration(request);
    return this.generateMigrationReport(managed);
  }
}
