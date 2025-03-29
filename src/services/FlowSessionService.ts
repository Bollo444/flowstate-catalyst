import { supabase } from "../lib/supabaseClient";
// Assuming types are correctly defined and exported from here
import {
  FlowState,
  FlowSession,
  SessionSummary,
  SessionResult,
  FlowSessionConfig,
} from "../types/flow";
import { FlowStatus } from "../types/database"; // Import FlowStatus from supabase types

export class FlowSessionService {
  private static readonly ACTIVE_SESSION_KEY = "activeFlowSession";
  private static readonly SESSION_TABLE = "flow_sessions"; // Using the table we added in SQL
  private static readonly FLOW_STATES_TABLE = "flow_states"; // Added for clarity
  private static readonly INTERRUPTIONS_TABLE = "flow_interruptions"; // Assumed table
  private static readonly supabase = supabase;

  // --- Session Lifecycle ---

  static async start(): Promise<{ initialState: FlowState }> {
    console.log("Attempting to start/resume flow session...");
    const {
      data: { user },
    } = await this.supabase.auth.getUser();
    if (!user) {
      console.error("User not authenticated. Cannot start session.");
      throw new Error("User not authenticated");
    }
    const userId = user.id;

    try {
      let activeSession = await this.getActiveSession(userId);

      if (!activeSession) {
        console.log("No active session found, creating a new one.");
        const initialFlowState: FlowState = {
          score: 50,
          status: "building",
          activeTime: 0,
          interruptions: 0,
          taskCompletions: 0,
        };
        const defaultConfig: FlowSessionConfig = {
          userId: userId,
          initialState: initialFlowState,
          type: "focus",
          settings: this.getDefaultSettings(),
        };
        activeSession = await this.create(defaultConfig);

        // Also create/update initial row in flow_states table
        const { error: upsertError } = await this.supabase
          .from(this.FLOW_STATES_TABLE)
          .upsert(
            {
              user_id: userId,
              score: initialFlowState.score,
              status: initialFlowState.status,
              active_time: initialFlowState.activeTime,
              interruptions: initialFlowState.interruptions, // Make sure flow_states has these columns
              task_completions: initialFlowState.taskCompletions, // Make sure flow_states has these columns
              updated_at: new Date().toISOString(),
            },
            { onConflict: "user_id" }
          );

        if (upsertError) {
          console.error("Error upserting initial flow state:", upsertError);
        }

        console.log(
          "New session created and initial state saved:",
          activeSession
        );
        return { initialState: initialFlowState };
      } else {
        console.log("Resuming existing active session:", activeSession.id);
        localStorage.setItem(
          this.ACTIVE_SESSION_KEY,
          JSON.stringify(activeSession)
        );

        const { data: currentFlowStateData, error: stateError } =
          await this.supabase
            .from(this.FLOW_STATES_TABLE)
            .select("*")
            .eq("user_id", userId)
            .single();

        if (stateError || !currentFlowStateData) {
          console.error(
            "Error fetching current flow state for resuming session:",
            stateError
          );
          return {
            initialState: {
              score: 0,
              status: "rest",
              activeTime: 0,
              interruptions: 0,
              taskCompletions: 0,
            },
          };
        }

        const currentFlowState: FlowState = {
          score: currentFlowStateData.score,
          status: currentFlowStateData.status as FlowStatus,
          activeTime: currentFlowStateData.active_time,
          interruptions: currentFlowStateData.interruptions || 0,
          taskCompletions: currentFlowStateData.task_completions || 0,
        };
        console.log("Resumed with current state:", currentFlowState);
        return { initialState: currentFlowState };
      }
    } catch (error) {
      console.error("Error in FlowSessionService.start:", error);
      return {
        initialState: {
          score: 0,
          status: "rest",
          activeTime: 0,
          interruptions: 0,
          taskCompletions: 0,
        },
      };
    }
  }

  static async create(config: FlowSessionConfig): Promise<FlowSession> {
    const session: FlowSession = {
      id: crypto.randomUUID(),
      userId: config.userId, // Ensure userId is part of FlowSession type
      teamId: config.teamId, // Ensure teamId is part of FlowSession type
      startTime: new Date(),
      initialState: config.initialState,
      participants: new Set([config.userId]),
      type: config.type || "focus",
      settings: config.settings || this.getDefaultSettings(),
      // goal: config.goal // If part of type
    };

    const dbData = {
      id: session.id,
      user_id: config.userId,
      team_id: config.teamId,
      start_time: session.startTime.toISOString(),
      initial_state: config.initialState,
      type: session.type,
      settings: session.settings,
    };

    const { error } = await this.supabase
      .from(this.SESSION_TABLE)
      .insert(dbData);
    if (error) throw error;

    localStorage.setItem(this.ACTIVE_SESSION_KEY, JSON.stringify(session));
    return session;
  }

  static async end(
    sessionId: string,
    summary: SessionSummary
  ): Promise<SessionResult> {
    console.log(`Ending session: ${sessionId}`);
    const endTime = new Date();
    const result: SessionResult = {
      sessionId,
      duration: this.calculateDuration(summary.startTime, endTime),
      flowScore: this.calculateAverageFlow(summary.transitions),
      productivity: this.calculateProductivity(summary),
      insights: this.generateInsights(summary),
    };

    const { error } = await this.supabase
      .from(this.SESSION_TABLE)
      .update({ end_time: endTime.toISOString(), summary: result })
      .eq("id", sessionId);

    if (error) throw error;

    localStorage.removeItem(this.ACTIVE_SESSION_KEY);
    console.log(`Session ${sessionId} ended. Summary:`, result);

    return result;
  }

  static async getActiveSession(userId: string): Promise<FlowSession | null> {
    console.log(`Checking active session for user: ${userId}`);
    const cached = localStorage.getItem(this.ACTIVE_SESSION_KEY);
    if (cached) {
      try {
        const parsed = JSON.parse(cached);
        if (parsed.startTime) parsed.startTime = new Date(parsed.startTime);
        if (Array.isArray(parsed.participants))
          parsed.participants = new Set(parsed.participants);
        else parsed.participants = new Set([userId]);
        // Ensure required fields are present
        if (
          parsed.id &&
          parsed.startTime &&
          parsed.participants &&
          parsed.userId === userId
        ) {
          return parsed as FlowSession;
        } else {
          localStorage.removeItem(this.ACTIVE_SESSION_KEY);
        }
      } catch (e) {
        localStorage.removeItem(this.ACTIVE_SESSION_KEY);
      }
    }
    const { data, error } = await this.supabase
      .from(this.SESSION_TABLE)
      .select("*")
      .eq("user_id", userId)
      .is("end_time", null)
      .maybeSingle();
    if (error) {
      console.error("Error fetching active session from DB:", error);
      return null;
    }
    if (data) {
      const session: FlowSession = {
        id: data.id,
        userId: data.user_id,
        teamId: data.team_id,
        startTime: new Date(data.start_time),
        participants: new Set([userId]), // Placeholder
        type: (data.type as "focus" | "collaboration") || "focus",
        initialState: (data.initial_state as FlowState) || undefined,
        settings: (data.settings as Record<string, any>) || undefined,
        // goal: data.goal,
      };
      localStorage.setItem(this.ACTIVE_SESSION_KEY, JSON.stringify(session));
      return session;
    }
    return null;
  }

  static async recordInterruption(
    type: string,
    recoveryTime: number
  ): Promise<FlowState> {
    console.warn(
      `Recording interruption: ${type}, Recovery: ${recoveryTime}ms`
    );
    const {
      data: { user },
    } = await this.supabase.auth.getUser();
    if (!user) throw new Error("User not authenticated");
    const userId = user.id;

    const activeSession = await this.getActiveSession(userId);
    if (!activeSession || !activeSession.id) {
      console.error("Cannot record interruption: No active session found.");
      return Promise.resolve({
        score: 0,
        status: "rest",
        activeTime: 0,
        interruptions: 0,
        taskCompletions: 0,
      });
    }
    const sessionId = activeSession.id;

    // 1. Record the interruption event (TODO: Requires flow_interruptions table)
    console.log(
      `TODO: Insert interruption record (Session: ${sessionId}, Type: ${type})`
    );
    /*
    const { error: interruptionError } = await this.supabase.from(this.INTERRUPTIONS_TABLE).insert({
       session_id: sessionId, user_id: userId, type: type, recovery_time_ms: recoveryTime, timestamp: new Date().toISOString()
     });
     if (interruptionError) console.error("Error recording interruption:", interruptionError);
    */

    // 2. Fetch current flow state from flow_states table
    const { data: currentFlowStateData, error: stateError } =
      await this.supabase
        .from(this.FLOW_STATES_TABLE)
        .select("score, status, interruptions, active_time, task_completions") // Select specific columns
        .eq("user_id", userId)
        .single(); // Expecting one row per user

    if (stateError || !currentFlowStateData) {
      console.error(
        "Error fetching current flow state for interruption:",
        stateError
      );
      // Return a slightly degraded state as fallback
      return Promise.resolve({
        score: 40,
        status: "rest",
        activeTime: 0,
        interruptions: 1,
        taskCompletions: 0,
      });
    }

    // 3. Recalculate state based on interruption
    const penalty = (recoveryTime / 60000) * 5;
    const newScore = Math.max(0, currentFlowStateData.score - penalty);
    const newStatus: FlowStatus = "rest";
    const newInterruptionsCount = (currentFlowStateData.interruptions || 0) + 1;

    const updatedState: FlowState = {
      score: newScore,
      status: newStatus,
      activeTime: currentFlowStateData.active_time,
      interruptions: newInterruptionsCount,
      taskCompletions: currentFlowStateData.task_completions || 0,
    };

    // 4. Update flow_states table
    const { error: updateError } = await this.supabase
      .from(this.FLOW_STATES_TABLE)
      .update({
        score: updatedState.score,
        status: updatedState.status,
        interruptions: updatedState.interruptions,
        updated_at: new Date().toISOString(),
      })
      .eq("user_id", userId);

    if (updateError) {
      console.error(
        "Error updating flow_states after interruption:",
        updateError
      );
      // Return the fetched state (before calculation) on failure
      // Needs conversion if DB columns don't directly match FlowState type
      const prevState: FlowState = {
        score: currentFlowStateData.score,
        status: currentFlowStateData.status as FlowStatus,
        activeTime: currentFlowStateData.active_time,
        interruptions: currentFlowStateData.interruptions || 0,
        taskCompletions: currentFlowStateData.task_completions || 0,
      };
      return Promise.resolve(prevState);
    }

    // 5. Update localStorage cache?
    const currentSessionData = JSON.parse(
      localStorage.getItem(this.ACTIVE_SESSION_KEY) || "{}"
    );
    // Update cache carefully, maybe only update relevant parts if initial state is cached
    localStorage.setItem(
      this.ACTIVE_SESSION_KEY,
      JSON.stringify({
        ...currentSessionData /* how to update state in cached session? */,
      })
    );

    console.log("Interruption recorded, updated state:", updatedState);
    return Promise.resolve(updatedState); // Return the newly calculated state
  }

  // --- Private Helper Methods ---

  private static calculateProductivity(summary: SessionSummary): number {
    if (!summary || !Array.isArray(summary.transitions)) return 0;
    const totalTime = summary.transitions.reduce(
      (acc, t) => acc + (t?.duration || 0),
      0
    );
    if (totalTime === 0) return 0;
    const flowTime = summary.transitions
      .filter((t) => t && (t.to === "flow" || t.to === "peak"))
      .reduce((acc, t) => acc + (t?.duration || 0), 0);
    return Math.round((flowTime / totalTime) * 100);
  }

  private static getDefaultSettings(): Record<string, any> {
    return {};
  }
  private static prepareSessionData(session: any): any {
    const { participants, ...rest } = session;
    return { ...rest }; // Exclude participants Set for now
  }
  private static calculateDuration(
    start: Date | string,
    end: Date | string
  ): number {
    const startTime =
      typeof start === "string" ? new Date(start).getTime() : start.getTime();
    const endTime =
      typeof end === "string" ? new Date(end).getTime() : end.getTime();
    return Math.max(0, endTime - startTime);
  }
  private static calculateAverageFlow(transitions: any[]): number {
    return 50;
  } // Mock
  private static generateInsights(
    summary: SessionSummary
  ): Record<string, any> {
    return {};
  } // Mock
}
