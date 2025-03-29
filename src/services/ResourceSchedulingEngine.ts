export class ResourceSchedulingEngine {
  private readonly scheduleMetrics = new Map<string, ScheduleMetrics>();
  private readonly engine: SchedulingEngine;

  generateSchedule(
    resources: ProjectResource[],
    demands: ResourceDemand[]
  ): ResourceSchedule {
    const allocation = this.calculateOptimalAllocation(resources, demands);
    const schedule = this.createResourceSchedule(allocation);

    return this.generateSchedulePlan(schedule);
  }
}
