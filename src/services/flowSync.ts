import { RealtimeChannel } from "@supabase/supabase-js";
import { supabase } from "../lib/supabaseClient";

export interface FlowState {
  userId: string;
  score: number;
  status: "peak" | "flow" | "rest" | "building";
  activeTime: number;
  lastUpdated: string;
}

interface PresenceState {
  userId: string;
  online: boolean;
  lastSeen: string;
}

type FlowUpdatePayload = {
  type: "flow_update";
  data: FlowState;
};

type PresenceUpdatePayload = {
  type: "presence_update";
  data: PresenceState;
};

type SyncPayload = FlowUpdatePayload | PresenceUpdatePayload;

export class FlowSyncService {
  private flowChannel: RealtimeChannel;
  private reconnectTimer: NodeJS.Timeout | null = null;
  private readonly RECONNECT_INTERVAL = 5000; // 5 seconds
  private listeners: Set<(state: FlowState) => void> = new Set();
  private presenceListeners: Set<(state: PresenceState[]) => void> = new Set();

  constructor() {
    this.flowChannel = this.initializeChannel();
  }

  private initializeChannel(): RealtimeChannel {
    const channel = supabase.channel("flow_updates", {
      config: {
        presence: {
          key: "userStatus",
        },
      },
    });

    channel
      .on("presence", { event: "sync" }, () => {
        const state = channel.presenceState();
        this.notifyPresenceListeners(this.formatPresenceState(state));
      })
      .on("presence", { event: "join" }, (payload: { key: string }) => {
        console.log("User joined:", payload.key);
        const state = channel.presenceState();
        this.notifyPresenceListeners(this.formatPresenceState(state));
      })
      .on("presence", { event: "leave" }, (payload: { key: string }) => {
        console.log("User left:", payload.key);
        const state = channel.presenceState();
        this.notifyPresenceListeners(this.formatPresenceState(state));
      })
      .on(
        "broadcast",
        { event: "flow_update" },
        (message: { payload: unknown }) => {
          if (this.isFlowUpdatePayload(message.payload)) {
            this.handleFlowUpdate(message.payload);
          }
        }
      );

    // Handle errors through the channel's error callback
    channel.subscribe((status) => {
      if (status === "CHANNEL_ERROR") {
        this.handleError(new Error("Channel error occurred"));
      }
    });

    this.connect();

    return channel;
  }

  private isFlowUpdatePayload(payload: any): payload is FlowUpdatePayload {
    return (
      payload &&
      payload.type === "flow_update" &&
      payload.data &&
      typeof payload.data === "object" &&
      "userId" in payload.data &&
      "score" in payload.data &&
      "status" in payload.data
    );
  }

  private async connect() {
    try {
      await this.flowChannel.subscribe(async (status) => {
        if (status === "SUBSCRIBED") {
          await this.trackPresence();
          console.log("Successfully connected to flow channel");
          if (this.reconnectTimer) {
            clearTimeout(this.reconnectTimer);
            this.reconnectTimer = null;
          }
        } else if (status === "CLOSED" || status === "CHANNEL_ERROR") {
          console.error("Channel connection failed:", status);
          this.handleReconnect();
        }
      });
    } catch (error) {
      console.error("Error connecting to flow channel:", error);
      this.handleReconnect();
    }
  }

  private async trackPresence() {
    const user = await supabase.auth.getUser();
    if (!user.data.user) return;

    await this.flowChannel.track({
      userId: user.data.user.id,
      online: true,
      lastSeen: new Date().toISOString(),
    });
  }

  private handleError(error: Error) {
    console.error("Flow channel error:", error);
    this.handleReconnect();
  }

  private handleReconnect() {
    if (this.reconnectTimer) return;

    this.reconnectTimer = setTimeout(() => {
      console.log("Attempting to reconnect...");
      this.flowChannel = this.initializeChannel();
      this.reconnectTimer = null;
    }, this.RECONNECT_INTERVAL);
  }

  private handleFlowUpdate(payload: FlowUpdatePayload) {
    this.notifyListeners(payload.data);
  }

  private formatPresenceState(state: Record<string, any>): PresenceState[] {
    return Object.entries(state).map(([userId, data]) => ({
      userId,
      online: data.online,
      lastSeen: data.lastSeen,
    }));
  }

  private notifyListeners(state: FlowState) {
    this.listeners.forEach((listener) => listener(state));
  }

  private notifyPresenceListeners(state: PresenceState[]) {
    this.presenceListeners.forEach((listener) => listener(state));
  }

  // Public methods

  async syncFlow(flowState: Omit<FlowState, "lastUpdated">) {
    try {
      const payload: FlowUpdatePayload = {
        type: "flow_update",
        data: {
          ...flowState,
          lastUpdated: new Date().toISOString(),
        },
      };

      await this.flowChannel.send({
        type: "broadcast",
        event: "flow_update",
        payload,
      });

      // Also persist to database
      await supabase.from("flow_states").upsert({
        user_id: flowState.userId,
        score: flowState.score,
        status: flowState.status,
        active_time: flowState.activeTime,
        updated_at: new Date().toISOString(),
      });
    } catch (error) {
      console.error("Error syncing flow state:", error);
      throw error;
    }
  }

  onFlowUpdate(listener: (state: FlowState) => void) {
    this.listeners.add(listener);
    return () => this.listeners.delete(listener);
  }

  onPresenceUpdate(listener: (state: PresenceState[]) => void) {
    this.presenceListeners.add(listener);
    return () => this.presenceListeners.delete(listener);
  }

  async disconnect() {
    if (this.reconnectTimer) {
      clearTimeout(this.reconnectTimer);
    }
    await this.flowChannel.unsubscribe();
  }
}

// Create and export a singleton instance
export const flowSyncService = new FlowSyncService();
