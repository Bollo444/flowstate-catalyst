export class StateEpochManager {
  private readonly epochs = new Map<string, Epoch>();
  private readonly manager: EpochManager;

  manageEpoch(state: State): EpochResult {
    const epoched = this.processEpoch(state);
    return this.generateEpochReport(epoched);
  }
}
