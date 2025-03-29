export class StateShardingManager {
  private readonly shards = new Map<string, StateShard>();
  private readonly manager: ShardingManager;

  manageShard(state: State): ShardingResult {
    const sharded = this.processShard(state);
    return this.generateShardingReport(sharded);
  }
}
