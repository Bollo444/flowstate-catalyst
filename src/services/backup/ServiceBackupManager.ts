export class ServiceBackupManager {
  private readonly backups = new Map<string, BackupHandler>();
  private readonly manager: BackupManager;

  manageBackup(request: BackupRequest): BackupResult {
    const managed = this.processBackup(request);
    return this.generateBackupReport(managed);
  }
}
