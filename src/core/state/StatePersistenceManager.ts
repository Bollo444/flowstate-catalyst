export class StatePersistenceManager {
  private readonly persistenceStrategies = new Map<
    string,
    PersistenceStrategy
  >();
  private readonly manager: PersistenceManager;

  persistState(state: State): PersistenceResult {
    const persisted = this.executePersistence(state);
    return this.generatePersistenceReport(persisted);
  }
}
