export class StateTombstoneManager {
  private readonly tombstones = new Map<string, Tombstone>();
  private readonly manager: TombstoneManager;

  manageTombstone(state: State): TombstoneResult {
    const tombstoned = this.processTombstone(state);
    return this.generateTombstoneReport(tombstoned);
  }
}
