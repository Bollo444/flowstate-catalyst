export class FlowSyncState {
  private state: FlowStateStore = {
    members: new Map(),
    activeSession: null,
    metrics: {
      teamFlow: 0,
      activeMembers: 0,
      peakFlowCount: 0,
      averageFlowScore: 0,
    },
    updates: [],
  };

  private subscribers = new Set<(state: FlowStateStore) => void>();

  updateMemberState(memberId: string, status: TeamMemberStatus): void {
    this.state.members.set(memberId, status);
    this.recalculateMetrics();
    this.notifySubscribers();
  }

  startSession(sessionData: FlowSession): void {
    this.state.activeSession = {
      ...sessionData,
      startTime: new Date(),
      participants: new Set(),
    };
    this.notifySubscribers();
  }

  addParticipant(memberId: string): void {
    if (this.state.activeSession) {
      this.state.activeSession.participants.add(memberId);
      this.notifySubscribers();
    }
  }

  addUpdate(update: FlowUpdate): void {
    this.state.updates.push({
      ...update,
      timestamp: new Date(),
    });
    this.recalculateMetrics();
    this.notifySubscribers();
  }

  private recalculateMetrics(): void {
    const activeMembers = Array.from(this.state.members.values()).filter(
      (member) => member.status === "active"
    );

    const flowScores = activeMembers.map((member) => member.flowState.score);

    this.state.metrics = {
      teamFlow: this.calculateTeamFlow(flowScores),
      activeMembers: activeMembers.length,
      peakFlowCount: activeMembers.filter((m) => m.flowState.status === "peak")
        .length,
      averageFlowScore:
        flowScores.reduce((a, b) => a + b, 0) / flowScores.length || 0,
    };
  }

  private calculateTeamFlow(scores: number[]): number {
    if (scores.length === 0) return 0;

    const harmonicMean = scores.length / scores.reduce((a, b) => a + 1 / b, 0);
    const synchronization = this.calculateSynchronization(scores);

    return Math.round((harmonicMean * 0.7 + synchronization * 0.3) * 100) / 100;
  }

  private calculateSynchronization(scores: number[]): number {
    if (scores.length <= 1) return 1;

    const average = scores.reduce((a, b) => a + b, 0) / scores.length;
    const variance =
      scores.reduce((a, b) => a + Math.pow(b - average, 2), 0) / scores.length;

    return 1 / (1 + Math.sqrt(variance));
  }

  subscribe(callback: (state: FlowStateStore) => void): () => void {
    this.subscribers.add(callback);
    callback(this.state);
    return () => this.subscribers.delete(callback);
  }

  private notifySubscribers(): void {
    this.subscribers.forEach((callback) => callback(this.state));
  }
}
