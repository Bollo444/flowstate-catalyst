import { FlowState, FlowAnalytics } from "@/types/flow";
import { Task } from "@/types/taskFlow";
import {
  OptimizationInput,
  FlowBlock,
  FlowPredictions,
  FlowOutcomePrediction,
  FlowSuggestion,
  FlowSuggestionType,
} from "@/types/optimizer"; // Import necessary types

// Simulated user preferences (could be fetched)
interface UserPreferences {
  peakStartTime?: number; // Preferred start hour (e.g., 9 for 9 AM)
  peakEndTime?: number; // Preferred end hour (e.g., 12 for 12 PM)
}

// Assume fetching these preferences, using defaults for now
const simulatedUserPrefs: UserPreferences = {
  peakStartTime: 9,
  peakEndTime: 12,
};

export class FlowOptimizer {
  private readonly BLOCK_DURATION = 25; // minutes
  private readonly MAX_BLOCKS = 12; // Represents 5 hours (12 * 25 min)

  generateBlocks({
    flowState,
    tasks,
    analytics,
  }: OptimizationInput): FlowBlock[] {
    const blocks: FlowBlock[] = [];
    const availableTasks = [...tasks];
    let currentTime = 0; // Represents minutes from the start of optimization period

    while (blocks.length < this.MAX_BLOCKS && availableTasks.length > 0) {
      const predictedState = this.predictFlowState(flowState, currentTime);
      const optimalTask = this.findOptimalTask(
        availableTasks,
        predictedState,
        analytics
      );

      if (optimalTask) {
        const duration = this.estimateTaskDuration(optimalTask);
        blocks.push({
          taskId: optimalTask.id,
          startTime: currentTime,
          duration: duration,
          predictedFlow: predictedState.score,
          confidence: this.calculateConfidence(optimalTask, predictedState),
        });

        const taskIndex = availableTasks.findIndex(
          (t) => t.id === optimalTask.id
        );
        if (taskIndex > -1) {
          availableTasks.splice(taskIndex, 1);
        }
        currentTime += duration;
      } else {
        // No suitable task found, advance time
        console.log(
          `No optimal task found at time ${currentTime}. Advancing to next block time.`
        );
        // Align to next block start
        currentTime =
          Math.ceil((currentTime + 1) / this.BLOCK_DURATION) *
          this.BLOCK_DURATION;
        if (currentTime >= this.MAX_BLOCKS * this.BLOCK_DURATION) break; // Stop if exceeding max time
      }
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
          optimalTimeSlot: block.startTime === this.findOptimalStartTime(block), // Corrected call signature & formatting
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

  // --- Private Helper Methods ---

  /**
   * Placeholder: Predicts the flow state after a certain duration.
   * Uses a simple decay model. Needs more sophisticated logic incorporating historical data.
   */
  private predictFlowState(
    currentState: FlowState,
    timeElapsedMinutes: number
  ): FlowState {
    const decayFactor = 0.05 + (currentState.score / 100) * 0.1;
    const decayAmount = (decayFactor / 60) * timeElapsedMinutes;
    const predictedScore = Math.max(0, currentState.score - decayAmount);
    const status =
      predictedScore < 35
        ? "rest"
        : predictedScore < 50
          ? "low"
          : predictedScore > 75
            ? "peak"
            : "mid";

    return {
      ...currentState,
      score: predictedScore,
      status: status as FlowState["status"],
    };
  }

  /**
   * Placeholder: Calculates confidence (0-1) in completing a task in the predicted state.
   * Factors in predicted flow state and estimated task complexity.
   */
  private calculateConfidence(task: Task, predictedState: FlowState): number {
    const complexity = this.estimateComplexity(task);
    const flowScoreFactor = predictedState.score / 100;
    const baseConfidence = 0.4;
    const flowBoost = flowScoreFactor * 0.5;
    const complexityPenalty = complexity * (1 - flowScoreFactor) * 0.6;
    const confidence = baseConfidence + flowBoost - complexityPenalty;
    return Math.min(Math.max(confidence, 0.05), 0.99);
  }

  /**
   * Placeholder: Estimates task duration in minutes. Returns default block duration if none specified.
   */
  private estimateTaskDuration(task: Task): number {
    return Math.max(5, task.estimatedDuration ?? this.BLOCK_DURATION);
  }

  /**
   * Placeholder: Determines the truly optimal start time (in minutes from period start) for a task block.
   * Simulated logic: Prefers morning based on simulated user prefs. Needs real implementation.
   */
  private findOptimalStartTime(
    block: FlowBlock
    /* analytics?: any, userPrefs?: UserPreferences */
  ): number {
    // TODO: Implement logic using historical analytics, user preferences, deadlines etc.
    console.warn(
      "findOptimalStartTime: Placeholder returning block's own startTime"
    );
    const preferredStart = (simulatedUserPrefs.peakStartTime ?? 9) * 60;
    return preferredStart; // Returning fixed preference for placeholder.
  }

  /**
   * Placeholder: Determines the type of suggestion based on prediction outcomes.
   */
  private getSuggestionType(
    prediction: FlowOutcomePrediction
  ): FlowSuggestionType {
    if (prediction.completionProbability < 0.4) return "warning";
    if (!prediction.optimalTimeSlot) return "optimization";
    return "info";
  }

  /**
   * Placeholder: Generates a user-friendly message for a suggestion.
   */
  private generateSuggestionMessage(prediction: FlowOutcomePrediction): string {
    const confidencePercent = (prediction.completionProbability * 100).toFixed(
      0
    ); // ESLint fix applied
    if (prediction.completionProbability < 0.4) {
      return `Low confidence (${confidencePercent}%) for this task. Consider a break or a simpler task.`;
    }
    if (!prediction.optimalTimeSlot) {
      return `This might not be the best time for this task based on predicted flow. Confidence: ${confidencePercent}%`;
    }
    return `Good fit for current predicted flow (${prediction.expectedFlowScore.toFixed(0)}). Confidence: ${confidencePercent}%`;
  }

  /**
   * Placeholder: Calculates the priority of a suggestion (1-10).
   */
  private calculateSuggestionPriority(
    prediction: FlowOutcomePrediction
  ): number {
    let priority = 5; // Base priority
    if (prediction.completionProbability < 0.4) {
      priority = 9; // High priority for low confidence warning
    } else if (!prediction.optimalTimeSlot) {
      priority = 7; // Medium for optimization
    } else if (prediction.completionProbability < 0.7) {
      priority = 4; // Lower if confidence is just okay
    }
    priority -= prediction.expectedFlowScore / 25; // Slightly reduce priority for higher predicted flow
    return Math.max(1, Math.min(Math.round(priority), 10)); // Clamp between 1-10
  }

  private findOptimalTask(
    tasks: Task[],
    predictedState: FlowState,
    analytics: FlowAnalytics
  ): Task | null {
    if (!tasks || tasks.length === 0) return null;

    const scoredTasks = tasks
      .map((task) => ({
        task,
        score: this.calculateTaskScore(task, predictedState, analytics),
      }))
      .filter((item) => item.score > 0); // Filter out tasks with zero or negative score if any

    if (scoredTasks.length === 0) return null; // No suitable tasks

    scoredTasks.sort((a, b) => b.score - a.score); // Sort descending by score

    return scoredTasks[0].task;
  }

  private calculateTaskScore(
    task: Task,
    state: FlowState,
    analytics: FlowAnalytics
  ): number {
    const flowAlignment = this.calculateFlowAlignment(task, state);
    const historicalSuccess = this.getHistoricalSuccess(task, analytics); // Uses placeholder
    const urgencyFactor = this.calculateUrgency(task); // Uses placeholder

    // Weights: Flow Alignment 40%, Urgency 35%, Historical Success 25%
    let score =
      flowAlignment * 0.4 + urgencyFactor * 0.35 + historicalSuccess * 0.25;

    // Boost score slightly if task marked as flow optimal
    if (task.flowOptimal) {
      score += 0.1;
    }

    // Penalize slightly for high context cost, scaled by current flow
    const contextCostPenalty =
      (task.contextCost ?? 0) * (1 - state.score / 100) * 0.2;
    score -= contextCostPenalty;

    return Math.max(0, Math.min(1, score)) * 100; // Return score between 0-100
  }

  /**
   * Calculates flow alignment between a task and a state.
   * Placeholder: Needs refinement.
   */
  private calculateFlowAlignment(task: Task, state: FlowState): number {
    const complexity = this.estimateComplexity(task);
    let alignment = 0;

    if (state.status === "peak") {
      alignment = 0.5 + complexity * 0.5; // Higher complexity aligns better with peak
    } else if (state.status === "mid") {
      alignment = 1.0 - Math.abs(complexity - 0.5); // Aligns best with medium complexity
    } else {
      // low or rest
      alignment = 0.5 + (1 - complexity) * 0.5; // Lower complexity aligns better with low/rest
    }

    // Factor in priority slightly - higher priority tasks are generally more "alignable"
    alignment = alignment * 0.8 + ((task.priority ?? 50) / 100) * 0.2;

    return Math.max(0, Math.min(1, alignment)); // Clamp between 0-1
  }

  /**
   * Estimates task complexity (0-1 scale).
   * Placeholder: Based on description length, duration, priority. Needs improvement.
   */
  private estimateComplexity(task: Task): number {
    const descriptionFactor = Math.min(
      (task.description?.length || 0) / 1000,
      1
    ); // Longer description = higher complexity
    const durationFactor = Math.min((task.estimatedDuration || 30) / 120, 1); // Longer duration = higher complexity
    const priorityFactor = (task.priority ?? 50) / 100;
    // Weight duration and description more heavily than priority for complexity
    return Math.max(
      0.1,
      Math.min(
        1,
        descriptionFactor * 0.4 + durationFactor * 0.4 + priorityFactor * 0.2
      )
    ); // Average factors, ensure non-zero min
  }

  /**
   * Calculates historical success rate for a task (0-1 scale).
   * Placeholder: Needs actual analytics integration.
   */
  private getHistoricalSuccess(task: Task, analytics: FlowAnalytics): number {
    // TODO: Implement actual logic using the 'analytics' object.
    console.warn(
      `getHistoricalSuccess: Placeholder for task ${task.id} returning default 0.75`
    );
    return 0.75; // Default success rate for now
  }

  /**
   * Calculates task urgency (0-1 scale).
   * Placeholder: Based on due date proximity.
   */
  private calculateUrgency(task: Task): number {
    if (!task.dueDate) return 0.1; // Low urgency if no due date
    try {
      const dueDate = new Date(task.dueDate);
      if (isNaN(dueDate.getTime())) {
        console.error("Invalid due date format:", task.dueDate);
        return 0.1;
      }
      const daysUntilDue =
        (dueDate.getTime() - Date.now()) / (1000 * 60 * 60 * 24);

      if (daysUntilDue < 0) return 1.0; // Overdue = Max urgency
      if (daysUntilDue < 1) return 0.9; // Due today/tomorrow = Very High
      if (daysUntilDue < 3) return 0.7; // Due within 3 days = High
      if (daysUntilDue < 7) return 0.5; // Due within a week = Medium
      return 0.2; // Low urgency otherwise
    } catch (e) {
      console.error(
        "Error parsing due date for urgency calculation:",
        task.dueDate,
        e
      );
      return 0.1; // Default to low urgency on error
    }
  }
} // End of FlowOptimizer class
