export class CoreTaskManager {
  private readonly tasks = new Map<string, TaskHandler>();
  private readonly manager: TaskManager;

  manageTask(request: TaskRequest): TaskResult {
    const managed = this.processTask(request);
    return this.generateTaskReport(managed);
  }
}
