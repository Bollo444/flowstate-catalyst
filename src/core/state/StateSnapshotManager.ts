export class StateSnapshotManager {
  private readonly snapshots = new Map<string, StateSnapshot>();
  private readonly manager: SnapshotManager;

  createSnapshot(state: State): SnapshotResult {
    const snapshot = this.captureSnapshot(state);
    return this.generateSnapshotReport(snapshot);
  }
}
