import { RealtimeChannel } from '@supabase/supabase-js';
import { supabase } from '../../lib/supabaseClient';
import { TeamSync, TeamMemberStatus } from '../../types/database';

export interface FlowSyncState {
  sessionId: string;
  teamId: string;
  participants: string[];
  averageFlowScore: number;
  startTime: string;
  endTime?: string;
  status: 'active' | 'paused' | 'ended';
  participantStates: Map<string, TeamMemberStatus>;
}

export class TeamFlowSync {
  private channel: RealtimeChannel | null = null;
  private syncState: FlowSyncState | null = null;
  private listeners: Set<(state: FlowSyncState) => void> = new Set();

  constructor(private teamId: string) {}

  async initialize() {
    // Subscribe to team sync channel
    this.channel = supabase.channel(`team-sync:${this.teamId}`)
      .on('presence', { event: 'sync' }, () => {
        this.broadcastState();
      })
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'team_member_status',
          filter: `team_id=eq.${this.teamId}`
        },
        (payload) => {
          this.handleStatusUpdate(payload.new as TeamMemberStatus);
        }
      )
      .subscribe(async (status) => {
        if (status === 'SUBSCRIBED') {
          await this.channel?.track({
            online_at: new Date().toISOString(),
          });
        }
      });
  }

  async startSync(participants: string[]): Promise<string> {
    try {
      const { data, error } = await supabase
        .from('team_syncs')
        .insert({
          team_id: this.teamId,
          participants,
          start_time: new Date().toISOString(),
          status: 'active',
          focus_score: 0
        })
        .select()
        .single();

      if (error) throw error;

      this.syncState = {
        sessionId: data.id,
        teamId: this.teamId,
        participants,
        averageFlowScore: 0,
        startTime: data.start_time,
        status: 'active',
        participantStates: new Map()
      };

      this.broadcastState();
      return data.id;
    } catch (error) {
      console.error('Failed to start team sync:', error);
      throw error;
    }
  }

  async endSync(sessionId: string, finalScore: number) {
    try {
      await supabase
        .from('team_syncs')
        .update({
          end_time: new Date().toISOString(),
          status: 'completed',
          focus_score: finalScore
        })
        .eq('id', sessionId);

      if (this.syncState?.sessionId === sessionId) {
        this.syncState.status = 'ended';
        this.syncState.endTime = new Date().toISOString();
        this.broadcastState();
      }

      this.cleanup();
    } catch (error) {
      console.error('Failed to end team sync:', error);
      throw error;
    }
  }

  async updateParticipantState(userId: string, state: Partial<TeamMemberStatus>) {
    if (!this.syncState) return;

    try {
      await supabase
        .from('team_member_status')
        .update(state)
        .eq('user_id', userId)
        .eq('team_id', this.teamId);

      const currentState = this.syncState.participantStates.get(userId);
      if (currentState) {
        this.syncState.participantStates.set(userId, {
          ...currentState,
          ...state
        });
        this.updateAverageFlowScore();
        this.broadcastState();
      }
    } catch (error) {
      console.error('Failed to update participant state:', error);
      throw error;
    }
  }

  subscribe(callback: (state: FlowSyncState) => void) {
    this.listeners.add(callback);
    if (this.syncState) {
      callback(this.syncState);
    }
    return () => this.listeners.delete(callback);
  }

  private broadcastState() {
    if (!this.syncState) return;
    this.listeners.forEach(listener => listener(this.syncState!));
  }

  private updateAverageFlowScore() {
    if (!this.syncState) return;

    const scores = Array.from(this.syncState.participantStates.values())
      .map(state => state.flowState.score)
      .filter(score => score > 0);

    this.syncState.averageFlowScore = scores.length > 0
      ? scores.reduce((sum, score) => sum + score, 0) / scores.length
      : 0;
  }

  private handleStatusUpdate(status: TeamMemberStatus) {
    if (!this.syncState) return;

    if (this.syncState.participants.includes(status.user_id)) {
      this.syncState.participantStates.set(status.user_id, status);
      this.updateAverageFlowScore();
      this.broadcastState();
    }
  }

  private cleanup() {
    if (this.channel) {
      this.channel.untrack();
      supabase.removeChannel(this.channel);
      this.channel = null;
    }
    this.syncState = null;
    this.listeners.clear();
  }

  async dispose() {
    this.cleanup();
  }
}