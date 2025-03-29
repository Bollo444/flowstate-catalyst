export class StatePartitionManager {
  private readonly partitioners = new Map<string, Partitioner>();
  private readonly manager: PartitionManager;

  managePartition(state: State): PartitionResult {
    const partitioned = this.processPartition(state);
    return this.generatePartitionReport(partitioned);
  }
}
