export class CoreQuorumManager {
  private readonly quorums = new Map<string, Quorum>();
  private readonly manager: QuorumManager;

  manageQuorum(nodes: QuorumNode[]): QuorumResult {
    const managed = this.processQuorum(nodes);
    return this.generateQuorumReport(managed);
  }
}
