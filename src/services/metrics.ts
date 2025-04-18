import { FlowSessionService } from "./FlowSessionService";
import { SessionResult, FlowState } from "../types/flow"; // Added FlowState import
import { supabase } from "../lib/supabaseClient"; // Import supabase client
// Assuming FLOW_STATES_TABLE might be exported or defined elsewhere, if not define here
// import { FLOW_STATES_TABLE } from "./FlowSessionService";

export interface MetricsAggregator {
  getHistoricalPerformance(userId: string): Promise<number>;
  calculateEnergyLevel(userId: string): Promise<number>;
  trackTaskCompletion(taskId: string, userId: string): Promise<void>; // Added userId
}

export class BasicMetrics implements MetricsAggregator {
  // Re-define if not exported/accessible from FlowSessionService
  private static readonly FLOW_STATES_TABLE = "flow_states";
  // Hypothetical table for tracking completion events
  // private static readonly TASK_COMPLETION_EVENTS_TABLE = "task_completion_events";

  async getHistoricalPerformance(userId: string): Promise<number> {
    try {
      const pastSessions: SessionResult[] =
        await FlowSessionService.getPastSessions(userId);

      if (!pastSessions || pastSessions.length === 0) {
        console.log(
          `No past sessions found for user ${userId}. Returning default performance score.`
        );
        return 75; // Return default score if no history
      }

      const validScores = pastSessions
        .map((session) => session.flowScore)
        .filter((score): score is number => typeof score === "number"); // Filter out null/undefined scores

      if (validScores.length === 0) {
        console.log(
          `No valid flow scores found in past sessions for user ${userId}. Returning default performance score.`
        );
        return 75; // Return default score if no valid scores found
      }

      const totalFlowScore = validScores.reduce((sum, score) => sum + score, 0);
      const averageFlowScore = totalFlowScore / validScores.length;

      console.log(
        `Calculated historical performance for user ${userId}: ${averageFlowScore}`
      );
      // Return score rounded to integer, assuming performance is 0-100
      return Math.round(averageFlowScore);
    } catch (error) {
      console.error("Error calculating historical performance:", error);
      return 50; // Return a neutral score on error
    }
  }

  async calculateEnergyLevel(userId: string): Promise<number> {
    try {
      // Fetch current flow state
      const { data: flowStateData, error: stateError } = await supabase
        .from(BasicMetrics.FLOW_STATES_TABLE)
        .select("score, task_completions, active_time")
        .eq("user_id", userId)
        .single();

      if (stateError || !flowStateData) {
        console.error(
          "Error fetching current flow state for energy calculation:",
          stateError
        );
        return 50; // Return neutral energy level on error
      }

      const { score, task_completions, active_time } = flowStateData;
      const taskCompletions = task_completions || 0;
      const activeTimeMinutes = (active_time || 0) / 60000; // Convert ms to minutes

      // Simple energy calculation logic (can be refined)
      let energy = 50; // Base energy
      energy += (score || 0) * 0.2; // Bonus for flow score (max +20)
      energy += Math.min(taskCompletions * 5, 15); // Bonus for task completions (max +15)
      energy -= Math.min(Math.floor(activeTimeMinutes / 15) * 5, 35); // Penalty for active time (max -35)

      // Clamp energy level between 0 and 100
      const finalEnergy = Math.max(0, Math.min(100, Math.round(energy)));

      console.log(`Calculated energy level for user ${userId}: ${finalEnergy}`);
      return finalEnergy;
    } catch (error) {
      console.error("Error calculating energy level:", error);
      return 50; // Return neutral energy level on error
    }
  }

  async trackTaskCompletion(taskId: string, userId: string): Promise<void> {
    try {
      console.log(`Tracking completion for task ${taskId} by user ${userId}`);

      // Option 1: Increment task_completions in flow_states table using RPC
      const { error: updateError } = await supabase.rpc(
        "increment_task_completions",
        { user_id_param: userId }
      );

      if (updateError) {
        console.error("Error incrementing task completions:", updateError);
        // Decide if we should still try Option 2 or throw/return
      } else {
        console.log(`Incremented task completions for user ${userId}`);
      }

      // Option 2: Insert into a dedicated event table (if it exists)
      /*
      const { error: insertError } = await supabase
        .from(BasicMetrics.TASK_COMPLETION_EVENTS_TABLE)
        .insert({
          task_id: taskId,
          user_id: userId,
          completed_at: new Date().toISOString(),
        });

      if (insertError) {
        console.error('Error inserting task completion event:', insertError);
      } else {
         console.log(`Recorded completion event for task ${taskId}`);
      }
      */
    } catch (error) {
      console.error(
        `Error tracking task completion for task ${taskId}:`,
        error
      );
    }
  }
}
