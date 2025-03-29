export class ServiceCircuitBreaker {
  private readonly breakers = new Map<string, CircuitBreaker>();
  private readonly manager: BreakerManager;

  handleCircuit(request: CircuitRequest): CircuitResult {
    const handled = this.processCircuit(request);
    return this.generateCircuitReport(handled);
  }
}
