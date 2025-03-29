export class ProjectManager {
  private readonly projects = new Map<string, ProjectConfig>();
  private readonly system: SystemManager;

  manageProject(config: SystemConfig): SystemResult {
    const managed = this.processProject(config);
    return this.generateProjectReport(managed);
  }
}
