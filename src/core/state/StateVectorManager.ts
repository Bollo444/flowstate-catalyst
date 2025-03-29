export class StateVectorManager {
  private readonly vectors = new Map<string, StateVector>();
  private readonly manager: VectorManager;

  manageVector(state: State): VectorResult {
    const vectored = this.processVector(state);
    return this.generateVectorReport(vectored);
  }
}
