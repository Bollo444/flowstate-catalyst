import { FlowState, FlowAnalytics } from "./flow";
import { Task } from "./taskFlow"; // Use the internal camelCase Task type

// Input for the main optimization function
export interface OptimizationInput {
  flowState: FlowState;
  tasks: Task[];
  analytics: FlowAnalytics;
  // Add other necessary inputs like user preferences, constraints, etc.
}

// Represents a single work block in the optimized schedule
export interface FlowBlock {
  taskId: string;
  startTime: number; // Time offset in minutes from the start of the optimization period
  duration: number; // Duration in minutes
  predictedFlow: number; // Expected flow score during this block
  confidence: number; // Confidence in completing the task within this block (0-1)
  // Potentially add other relevant block info (e.g., predicted energy level)
}

// Represents the prediction for a single task outcome
export interface FlowOutcomePrediction {
  completionProbability: number; // Probability of completing the task (0-1)
  expectedFlowScore: number; // Predicted flow score upon completion
  optimalTimeSlot: boolean; // Whether this block is considered the best time
  // Add other prediction details (e.g., estimated completion time variation)
}

// Represents the overall predictions for multiple tasks
export type FlowPredictions = Record<string, FlowOutcomePrediction>; // Map of taskId to its prediction

// Represents the type of suggestion
export type FlowSuggestionType = "optimization" | "warning" | "info" | "break";

// Represents a single actionable suggestion from the optimizer
export interface FlowSuggestion {
  taskId?: string; // Optional: Suggestion might not be task-specific (e.g., take a break)
  type: FlowSuggestionType;
  message: string; // User-friendly message
  priority: number; // Suggestion priority (e.g., 1-10)
  // Add potential actions or metadata
}