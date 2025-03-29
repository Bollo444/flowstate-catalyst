export class ServiceScheduler {
  private readonly schedulers = new Map<string, Scheduler>();
  private readonly manager: ScheduleManager;

  scheduleTask(task: ScheduleRequest): ScheduleResult {
    const scheduled = this.processSchedule(task);
    return this.generateScheduleReport(scheduled);
  }
}
