// src/services/api/teamService.ts

import { SupabaseClient } from '@supabase/supabase-js';

interface TeamServiceConfig {
  supabase: SupabaseClient;
}

export class TeamService {
  private supabase: SupabaseClient;

  constructor(config: TeamServiceConfig) {
    this.supabase = config.supabase;
  }

  async getTeamMetrics(teamId: string, timeframe: string) {
    const { data, error } = await this.supabase
      .from('flow_metrics')
      .select(`
        *,
        team_members (
          user:users (
            id,
            name,
            avatar_url
          )
        )
      `)
      .eq('team_id', teamId)
      .gte('timestamp', this.getTimeframeStart(timeframe))
      .order('timestamp', { ascending: true });

    if (error) throw error;
    return data;
  }

  private getTimeframeStart(timeframe: string) {
    // Dummy implementation - replace with actual timeframe calculation
    console.log('getTimeframeStart not implemented');
    return '2024-01-01';
  }

  async getTeamActivities(teamId: string, limit = 20) {
    const { data, error } = await this.supabase
      .from('team_activities')
      .select(`
        *,
        user:users (
          id,
          name,
          avatar_url
        )
      `)
      .eq('team_id', teamId)
      .order('created_at', { ascending: false })
      .limit(limit);

    if (error) throw error;
    return data;
  }

  async updateTeamMetrics(teamId: string, metrics: any) {
    const { data, error } = await this.supabase
      .from('flow_metrics')
      .insert([
        {
          team_id: teamId,
          ...metrics,
          timestamp: new Date().toISOString()
        }
      ])
      .select();

    if (error) throw error;
    return data;
  }
}