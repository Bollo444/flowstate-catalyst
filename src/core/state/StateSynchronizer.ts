export class StateSynchronizer {
  private readonly syncQueue = new Map<string, SyncOperation>();
  private readonly synchronizer: Synchronizer;

  synchronizeState(states: State[]): SyncResult {
    const synchronized = this.performSync(states);
    return this.generateSyncReport(synchronized);
  }
}
