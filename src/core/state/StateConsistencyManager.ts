export class StateConsistencyManager {
  private readonly consistencyCheckers = new Map<string, ConsistencyChecker>();
  private readonly manager: ConsistencyManager;

  ensureConsistency(state: State): ConsistencyResult {
    const checked = this.checkConsistency(state);
    return this.generateConsistencyReport(checked);
  }
}
