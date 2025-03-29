export class ServiceProtocolManager {
  private readonly protocols = new Map<string, ProtocolHandler>();
  private readonly manager: ProtocolManager;

  manageProtocol(request: ProtocolRequest): ProtocolResult {
    const managed = this.processProtocol(request);
    return this.generateProtocolReport(managed);
  }
}
