export class StateCheckpointManager {
  private readonly checkpoints = new Map<string, Checkpoint>();
  private readonly manager: CheckpointManager;

  manageCheckpoint(state: State): CheckpointResult {
    const checkpointed = this.processCheckpoint(state);
    return this.generateCheckpointReport(checkpointed);
  }
}
