export class DataBackupManager {
  private readonly backups = new Map<string, Backup>();
  private readonly manager: BackupManager;

  backupData(data: BackupableData): BackupResult {
    const backed = this.processBackup(data);
    return this.generateBackupReport(backed);
  }
}
