import { supabase } from '../../lib/supabaseClient';
import { TeamMemberStatus } from '../../types/database';

export interface CollaborationTimeSlot {
  start: number;
  end: number;
  score: number;
  participants: string[];
}

export interface FlowOptimization {
  suggestion: string;
  impact: 'high' | 'medium' | 'low';
  action?: string;
}

export class TeamCollaboration {
  constructor(private teamId: string) {}

  /**
   * Calculate optimal collaboration time slots based on team member preferences and flow patterns
   */
  async calculateOptimalTimes(
    members: TeamMemberStatus[],
    duration: number = 60 // minutes
  ): Promise<CollaborationTimeSlot[]> {
    const timeSlots: CollaborationTimeSlot[] = [];

    // Get each member's preferred hours
    const memberPreferences = members.map(member => ({
      userId: member.user_id,
      preferred: member.focusPreferences?.preferredFocusHours || [],
      minimumBlock: member.focusPreferences?.minimumFocusBlock || 30
    }));

    // Find overlapping time slots
    for (let hour = 0; hour < 24; hour++) {
      const availableMembers = memberPreferences.filter(member =>
        member.preferred.includes(hour)
      );

      if (availableMembers.length >= 2) { // At least 2 members needed for collaboration
        // Check if we can form a time block of required duration
        let blockEnd = hour;
        let validBlock = true;
        const requiredSlots = Math.ceil(duration / 60);

        for (let slot = 0; slot < requiredSlots; slot++) {
          const slotHour = (hour + slot) % 24;
          const membersAvailable = memberPreferences.filter(member =>
            member.preferred.includes(slotHour)
          );

          if (membersAvailable.length < 2) {
            validBlock = false;
            break;
          }
          blockEnd = slotHour;
        }

        if (validBlock) {
          timeSlots.push({
            start: hour,
            end: blockEnd,
            score: this.calculateTimeSlotScore(hour, availableMembers.length, members.length),
            participants: availableMembers.map(m => m.userId)
          });
        }
      }
    }

    return timeSlots.sort((a, b) => b.score - a.score);
  }

  /**
   * Get flow optimization suggestions for the team
   */
  async getFlowOptimizations(): Promise<FlowOptimization[]> {
    const optimizations: FlowOptimization[] = [];

    // Analyze team flow patterns
    const { data: sessions } = await supabase
      .from('team_syncs')
      .select('*')
      .eq('team_id', this.teamId)
      .order('created_at', { ascending: false })
      .limit(100);

    if (sessions) {
      // Check session frequency
      const sessionFrequency = this.calculateSessionFrequency(sessions);
      if (sessionFrequency < 2) { // Less than 2 sessions per week
        optimizations.push({
          suggestion: 'Increase team sync frequency',
          impact: 'high',
          action: 'Schedule at least 2 team flow sessions per week'
        });
      }

      // Check average session duration
      const avgDuration = this.calculateAverageSessionDuration(sessions);
      if (avgDuration < 45) { // Less than 45 minutes
        optimizations.push({
          suggestion: 'Extend sync session duration',
          impact: 'medium',
          action: 'Aim for 60-90 minute sessions for optimal flow state'
        });
      }

      // Check completion rate
      const completionRate = this.calculateCompletionRate(sessions);
      if (completionRate < 0.8) { // Less than 80% completion
        optimizations.push({
          suggestion: 'Improve session completion rate',
          impact: 'high',
          action: 'Review and address common interruption causes'
        });
      }
    }

    return optimizations;
  }

  /**
   * Check if current time is suitable for team collaboration
   */
  async checkCollaborationSuitability(members: TeamMemberStatus[]): Promise<boolean> {
    const activeMembers = members.filter(m => 
      m.status === 'available' || m.status === 'focusing'
    );

    if (activeMembers.length < 2) return false;

    // Check if it's within optimal hours for most team members
    const currentHour = new Date().getHours();
    const membersInOptimalTime = members.filter(member =>
      member.focusPreferences?.preferredFocusHours.includes(currentHour)
    );

    return membersInOptimalTime.length >= Math.ceil(members.length / 2);
  }

  private calculateTimeSlotScore(hour: number, availableCount: number, totalCount: number): number {
    const timeOfDayScore = this.getTimeOfDayScore(hour);
    const participationScore = (availableCount / totalCount) * 100;
    
    return Math.round((timeOfDayScore + participationScore) / 2);
  }

  private getTimeOfDayScore(hour: number): number {
    // Assume typical work hours (9-17) get higher scores
    if (hour >= 9 && hour <= 17) return 100;
    if (hour >= 8 && hour <= 18) return 80;
    if (hour >= 7 && hour <= 19) return 60;
    return 40;
  }

  private calculateSessionFrequency(sessions: any[]): number {
    if (!sessions.length) return 0;

    const weekMs = 7 * 24 * 60 * 60 * 1000;
    const now = new Date().getTime();
    const recentSessions = sessions.filter(s =>
      (now - new Date(s.created_at).getTime()) <= weekMs
    );

    return recentSessions.length;
  }

  private calculateAverageSessionDuration(sessions: any[]): number {
    if (!sessions.length) return 0;

    const durations = sessions
      .filter(s => s.end_time)
      .map(s => {
        const start = new Date(s.start_time).getTime();
        const end = new Date(s.end_time).getTime();
        return (end - start) / (1000 * 60); // Convert to minutes
      });

    return durations.reduce((sum, duration) => sum + duration, 0) / durations.length;
  }

  private calculateCompletionRate(sessions: any[]): number {
    if (!sessions.length) return 0;

    const completed = sessions.filter(s => s.status === 'completed').length;
    return completed / sessions.length;
  }
}