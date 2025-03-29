export class DeliverableManager {
  private readonly deliverableMetrics = new Map<string, DeliverableMetrics>();
  private readonly managementEngine: ManagementEngine;

  manageDeliverables(
    deliverables: Deliverable[],
    timeline: Timeline
  ): DeliverablePlan {
    const tracking = this.trackDeliverables(deliverables, timeline);
    const schedule = this.createDeliverableSchedule(tracking);

    return this.generateDeliverablePlan(schedule);
  }
}
