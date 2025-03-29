export class CoreHeartbeatManager {
  private readonly heartbeats = new Map<string, Heartbeat>();
  private readonly manager: HeartbeatManager;

  manageHeartbeat(node: SystemNode): HeartbeatResult {
    const beaten = this.processHeartbeat(node);
    return this.generateHeartbeatReport(beaten);
  }
}
