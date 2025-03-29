export class DeliverableTrackingEngine {
  private readonly trackingMetrics = new Map<string, TrackingMetrics>();
  private readonly engine: TrackingEngine;

  trackDeliverables(
    deliverables: Deliverable[],
    timeline: Timeline
  ): TrackingReport {
    const tracking = this.monitorDeliverables(deliverables, timeline);
    return this.generateTrackingReport(tracking);
  }
}
