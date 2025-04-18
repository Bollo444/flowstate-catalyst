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
  private static readonly SESSION_TABLE = "flow_sessions";
  private static readonly FLOW_STATES_TABLE = "flow_states";
  private static readonly INTERRUPTIONS_TABLE = "flow_interruptions"; // Table to record interruptions
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
              interruptions: initialFlowState.interruptions,
              task_completions: initialFlowState.taskCompletions,
              updated_at: new Date().toISOString(),
            },
            { onConflict: "user_id" }
          );

        if (upsertError) {
          console.error("Error upserting initial flow state:", upsertError);
          // Decide if we should throw or just log
        }

        console.log(
          "New session created and initial state saved:",
          activeSession
        );
        return { initialState: initialFlowState };
      } else {
        console.log("Resuming existing active session:", activeSession.id);
        // Update localStorage with the potentially refreshed session data
        localStorage.setItem(
          this.ACTIVE_SESSION_KEY,
          JSON.stringify(activeSession) // activeSession is fetched from DB or cache now
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
          // Return a default 'rest' state if DB state is missing
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

        // Construct FlowState matching the type definition
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
      // Return default state on error
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
      userId: config.userId,
      teamId: config.teamId,
      startTime: new Date(),
      initialState: config.initialState,
      participants: new Set([config.userId]), // Initial participant is the user starting it
      type: config.type || "focus",
      settings: config.settings || this.getDefaultSettings(),
    };

    const dbData = {
      id: session.id,
      user_id: config.userId,
      team_id: config.teamId,
      start_time: session.startTime.toISOString(),
      initial_state: config.initialState,
      type: session.type,
      settings: session.settings,
      // end_time and summary are null initially
    };

    const { error } = await this.supabase
      .from(this.SESSION_TABLE)
      .insert(dbData);

    if (error) {
      console.error("Error creating session in DB:", error);
      throw error;
    }

    // Store essential session info (including ID) in localStorage
    localStorage.setItem(
      this.ACTIVE_SESSION_KEY,
      JSON.stringify({
        id: session.id,
        userId: session.userId,
        startTime: session.startTime.toISOString(), // Store as ISO string
      })
    );

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
      flowScore: this.calculateAverageFlow(summary.transitions), // Placeholder calculation
      productivity: this.calculateProductivity(summary), // Placeholder calculation
      insights: this.generateInsights(summary), // Placeholder calculation
    };

    const { error } = await this.supabase
      .from(this.SESSION_TABLE)
      .update({
        end_time: endTime.toISOString(),
        summary: result as any, // Cast summary to 'any' if Supabase types clash with complex object
      })
      .eq("id", sessionId);

    if (error) {
      console.error("Error updating session end_time/summary:", error);
      throw error;
    }

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
        // Basic validation of cached data
        if (parsed.id && parsed.userId === userId && parsed.startTime) {
          console.log("Found potentially valid cached session:", parsed.id);
          // Consider fetching from DB anyway to ensure it's still active and get latest data
          // For now, return cached if structure seems okay
          return {
            ...parsed,
            startTime: new Date(parsed.startTime), // Convert back to Date object
            participants: new Set([parsed.userId]), // Reconstruct Set
          } as FlowSession;
        } else {
          console.warn("Invalid cached session data found, removing.");
          localStorage.removeItem(this.ACTIVE_SESSION_KEY);
        }
      } catch (e) {
        console.error("Error parsing cached session, removing.", e);
        localStorage.removeItem(this.ACTIVE_SESSION_KEY);
      }
    }

    // If no valid cache, check DB
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
      console.log("Found active session in DB:", data.id);
      const session: FlowSession = {
        id: data.id,
        userId: data.user_id,
        teamId: data.team_id,
        startTime: new Date(data.start_time),
        participants: new Set([data.user_id]), // Correctly init participants Set
        type: (data.type as "focus" | "collaboration") || "focus",
        initialState: (data.initial_state as FlowState) || undefined,
        settings: (data.settings as Record<string, any>) || undefined,
        // goal: data.goal, // uncomment if added to type/schema
      };
      // Cache the fetched active session
      localStorage.setItem(
        this.ACTIVE_SESSION_KEY,
        JSON.stringify({
          id: session.id,
          userId: session.userId,
          startTime: session.startTime.toISOString(),
        })
      );
      return session;
    }
    console.log("No active session found in DB or cache.");
    return null;
  }

  static async recordInterruption(
    type: string,
    recoveryTime: number // Assume milliseconds
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
      // Return current state from DB or a default 'rest' state
      const { data: currentState } = await this.supabase
        .from(this.FLOW_STATES_TABLE)
        .select("score, status, interruptions, active_time, task_completions")
        .eq("user_id", userId)
        .single();
      return {
        score: currentState?.score ?? 0,
        status: (currentState?.status as FlowStatus) ?? "rest",
        activeTime: currentState?.active_time ?? 0,
        interruptions: currentState?.interruptions ?? 0,
        taskCompletions: currentState?.task_completions ?? 0,
      };
    }
    const sessionId = activeSession.id;

    // 1. Record the interruption event in the database
    const { error: interruptionError } = await this.supabase
      .from(this.INTERRUPTIONS_TABLE)
      .insert({
        session_id: sessionId,
        user_id: userId,
        type: type,
        recovery_time_ms: recoveryTime,
        timestamp: new Date().toISOString(), // Record when interruption occurred
      });

    if (interruptionError) {
      console.error("Error recording interruption to DB:", interruptionError);
      // Decide if we should proceed to update state or throw
    } else {
      console.log(
        `Interruption recorded in DB (Session: ${sessionId}, Type: ${type})`
      );
    }

    // 2. Fetch current flow state from flow_states table
    const { data: currentFlowStateData, error: stateError } =
      await this.supabase
        .from(this.FLOW_STATES_TABLE)
        .select("score, status, interruptions, active_time, task_completions")
        .eq("user_id", userId)
        .single();

    if (stateError || !currentFlowStateData) {
      console.error(
        "Error fetching current flow state for interruption update:",
        stateError
      );
      // Return a sensible default state on error
      return {
        score: 40, // Degraded score
        status: "rest",
        activeTime: 0,
        interruptions: 1, // Assume at least this interruption happened
        taskCompletions: 0,
      };
    }

    // 3. Recalculate state based on interruption
    const penalty = (recoveryTime / 60000) * 5; // Example penalty calculation
    const newScore = Math.max(0, currentFlowStateData.score - penalty);
    // Corrected: Set status to 'rest' on interruption, as 'interrupted' is not a valid FlowStatus
    const newStatus: FlowStatus = "rest";
    const newInterruptionsCount = (currentFlowStateData.interruptions || 0) + 1;

    const updatedState: FlowState = {
      score: newScore,
      status: newStatus,
      activeTime: currentFlowStateData.active_time, // Active time is usually paused during interruption
      interruptions: newInterruptionsCount,
      taskCompletions: currentFlowStateData.task_completions || 0,
    };

    // 4. Update flow_states table with the new state
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
      const prevState: FlowState = {
        score: currentFlowStateData.score,
        status: currentFlowStateData.status as FlowStatus,
        activeTime: currentFlowStateData.active_time,
        interruptions: currentFlowStateData.interruptions || 0,
        taskCompletions: currentFlowStateData.task_completions || 0,
      };
      return prevState;
    }

    // 5. Removed localStorage update for session state; rely on DB or hook state
    console.log("Interruption processed, updated state:", updatedState);
    return updatedState; // Return the newly calculated state
  }

  // New method to fetch past sessions
  static async getPastSessions(userId: string): Promise<SessionResult[]> {
    console.log(`Fetching past sessions for user: ${userId}`);
    const { data, error } = await this.supabase
      .from(this.SESSION_TABLE)
      .select("summary") // Select only the summary column which contains SessionResult
      .eq("user_id", userId)
      .not("end_time", "is", null) // Only completed sessions
      .order("start_time", { ascending: false }); // Optional: order by time

    if (error) {
      console.error("Error fetching past sessions:", error);
      return [];
    }

    // The 'summary' column should contain the SessionResult object
    const sessionsData = data as { summary: SessionResult | null }[] | null;
    return (
      sessionsData
        ?.map((item) => item.summary)
        // Use type predicate to ensure correct type and filter nulls
        .filter((summary): summary is SessionResult => summary != null) || []
    );
  }

  // --- Private Helper Methods ---

  private static calculateProductivity(summary: SessionSummary): number {
    // Placeholder implementation
    if (!summary || !Array.isArray(summary.transitions)) return 0;
    // Example: const totalDuration = ...; const productiveDuration = ...; return (productiveDuration / totalDuration) * 100;
    return 75; // Mock value
  }

  private static getDefaultSettings(): Record<string, any> {
    return {}; // Return empty object or define default settings
  }

  // prepareSessionData might not be needed if participants Set is handled correctly
  // private static prepareSessionData(session: any): any { ... }

  private static calculateDuration(
    start: Date | string,
    end: Date | string
  ): number {
    const startTime =
      typeof start === "string" ? new Date(start).getTime() : start.getTime();
    const endTime =
      typeof end === "string" ? new Date(end).getTime() : end.getTime();
    return Math.max(0, endTime - startTime); // Return duration in milliseconds
  }

  private static calculateAverageFlow(transitions: any[]): number {
    // Placeholder - requires actual transition data structure and logic
    if (!transitions || transitions.length === 0) return 50;
    // Example: average score from transitions where state was flow/peak
    return 65; // Mock value
  }

  private static generateInsights(
    summary: SessionSummary
  ): Record<string, any> {
    // Placeholder - requires more data and analysis logic
    return { note: "Analysis pending implementation." }; // Mock
  }
}
