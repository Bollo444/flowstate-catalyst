export class DataConsistencyChecker {
  private readonly checkers = new Map<string, ConsistencyChecker>();
  private readonly engine: ConsistencyEngine;

  checkConsistency(data: CheckableData): ConsistencyResult {
    const checked = this.processConsistencyCheck(data);
    return this.generateConsistencyReport(checked);
  }
}
