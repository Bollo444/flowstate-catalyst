export class BackupInfra {
  private readonly backups = new Map<string, BackupConfig>();
  private readonly manager: InfrastructureManager;

  configureBackup(options: ConfigOptions): ConfigResult {
    const configured = this.processConfig(options);
    return this.generateConfigReport(configured);
  }
}
