export class StateConflictResolver {
  private readonly resolvers = new Map<string, ConflictResolver>();
  private readonly engine: ResolverEngine;

  resolveConflict(states: State[]): ResolutionResult {
    const resolved = this.handleConflict(states);
    return this.generateResolutionReport(resolved);
  }
}
