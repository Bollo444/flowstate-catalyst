export class StateDiffCalculator {
  private readonly calculators = new Map<string, DiffCalculator>();
  private readonly engine: CalculatorEngine;

  calculateDiff(oldState: State, newState: State): DiffResult {
    const diff = this.computeDiff(oldState, newState);
    return this.generateDiffReport(diff);
  }
}
