export class FlowStreamManager {
  private readonly streamMetrics = new Map<string, StreamMetrics>();
  private readonly flowEngine: FlowEngine;

  manageFlowStream(
    userState: FlowState,
    streamConfig: StreamConfig
  ): FlowStream {
    const optimization = this.optimizeStreamFlow(userState, streamConfig);
    const schedule = this.createStreamSchedule(optimization);

    return this.initializeFlowStream(schedule);
  }
}
