export class TypeManager {
  private readonly types = new Map<string, TypeConfig>();
  private readonly system: SystemManager;

  manageType(config: SystemConfig): SystemResult {
    const managed = this.processType(config);
    return this.generateTypeReport(managed);
  }
}
