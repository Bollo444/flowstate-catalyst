export class BackupDocumentation {
  private readonly backups = new Map<string, BackupDoc>();
  private readonly generator: DocGenerator;

  generateBackupDoc(config: DocConfig): DocResult {
    const generated = this.processBackup(config);
    return this.generateDocReport(generated);
  }
}
