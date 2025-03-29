export class TaskOptimizer {
  private readonly contextMap = new Map<string, TaskContext>();
  private readonly flowThresholds: FlowThresholds;

  optimizeTaskSequence(tasks: Task[], flowState: FlowState): OptimizedSequence {
    const contexts = this.buildContextMap(tasks);
    const scores = this.calculateTaskScores(tasks, flowState);

    return this.generateOptimalSequence(tasks, scores, contexts);
  }
}
