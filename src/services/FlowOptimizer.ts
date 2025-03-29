export class FlowOptimizer {
  private readonly BLOCK_DURATION = 25; // minutes
  private readonly MAX_BLOCKS = 12;

  generateBlocks({
    flowState,
    tasks,
    analytics,
  }: OptimizationInput): FlowBlock[] {
    const blocks: FlowBlock[] = [];
    const availableTasks = [...tasks];
    let currentTime = 0;

    while (blocks.length < this.MAX_BLOCKS && availableTasks.length > 0) {
      const predictedState = this.predictFlowState(flowState, currentTime);
      const optimalTask = this.findOptimalTask(
        availableTasks,
        predictedState,
        analytics
      );

      if (optimalTask) {
        blocks.push({
          taskId: optimalTask.id,
          startTime: currentTime,
          duration: this.BLOCK_DURATION,
          predictedFlow: predictedState.score,
          confidence: this.calculateConfidence(optimalTask, predictedState),
        });

        availableTasks.splice(availableTasks.indexOf(optimalTask), 1);
      }

      currentTime += this.BLOCK_DURATION;
    }

    return blocks;
  }

  predictOutcomes(blocks: FlowBlock[]): FlowPredictions {
    return blocks.reduce(
      (predictions, block) => ({
        ...predictions,
        [block.taskId]: {
          completionProbability: block.confidence,
          expectedFlowScore: block.predictedFlow,
          optimalTimeSlot: block.startTime === this.findOptimalStartTime(block),
        },
      }),
      {}
    );
  }

  generateSuggestions(predictions: FlowPredictions): FlowSuggestion[] {
    return Object.entries(predictions)
      .map(([taskId, prediction]) => ({
        taskId,
        type: this.getSuggestionType(prediction),
        message: this.generateSuggestionMessage(prediction),
        priority: this.calculateSuggestionPriority(prediction),
      }))
      .sort((a, b) => b.priority - a.priority);
  }

  private findOptimalTask(
    tasks: Task[],
    predictedState: FlowState,
    analytics: FlowAnalytics
  ): Task | null {
    return (
      tasks
        .map((task) => ({
          task,
          score: this.calculateTaskScore(task, predictedState, analytics),
        }))
        .sort((a, b) => b.score - a.score)
        .map(({ task }) => task)[0] || null
    );
  }

  private calculateTaskScore(
    task: Task,
    state: FlowState,
    analytics: FlowAnalytics
  ): number {
    const flowAlignment = this.calculateFlowAlignment(task, state);
    const historicalSuccess = this.getHistoricalSuccess(task, analytics);
    const urgencyFactor = this.calculateUrgency(task);

    return flowAlignment * 0.4 + historicalSuccess * 0.3 + urgencyFactor * 0.3;
  }
}
