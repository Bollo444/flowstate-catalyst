// src/features/flowRewards/DailyFlowStreak.ts

import { SupabaseClient } from '@supabase/supabase-js';
import { Database } from '@/types/supabase';
import { User } from '@supabase/auth-helpers-react';

export class DailyFlowStreak {
  private supabase: SupabaseClient<Database>;
  private user: User | null;

  constructor(supabaseClient: SupabaseClient<Database>, user: User | null) {
    this.supabase = supabaseClient;
    this.user = user;
  }

  public async updateStreak(): Promise<void> {
    if (!this.user) {
      return;
    }

    try {
      const today = new Date();
      const { data: streakData, error } = await this.supabase
        .from('flow_streaks')
        .select('*')
        .eq('user_id', this.user.id)
        .single();

      if (error) {
        console.error('Error fetching streak data:', error);
        return;
      }

      if (!streakData) {
        // Create a new streak if none exists
        await this.createStreak();
        return;
      }

      const lastStreakDate = new Date(streakData.last_streak_date);

      if (this.isToday(lastStreakDate)) {
        // Streak already updated today
        return;
      }

      if (this.isYesterday(lastStreakDate)) {
        // Increment streak
        await this.incrementStreak(streakData);
      } else {
        // Reset streak
        await this.resetStreak();
      }
    } catch (error) {
      console.error('Error updating streak:', error);
    }
  }

  private async createStreak(): Promise<void> {
    try {
      await this.supabase.from('flow_streaks').insert([
        {
          user_id: this.user!.id,
          current_streak: 1,
          longest_streak: 1,
          last_streak_date: new Date(),
        },
      ]);
    } catch (error) {
      console.error('Error creating streak:', error);
    }
  }

  private async incrementStreak(streakData: any): Promise<void> {
    try {
      await this.supabase
        .from('flow_streaks')
        .update({
          current_streak: streakData.current_streak + 1,
          longest_streak: Math.max(streakData.longest_streak, streakData.current_streak + 1),
          last_streak_date: new Date(),
        })
        .eq('user_id', this.user!.id);
    } catch (error) {
      console.error('Error incrementing streak:', error);
    }
  }

  private async resetStreak(): Promise<void> {
    try {
      await this.supabase
        .from('flow_streaks')
        .update({
          current_streak: 1,
          last_streak_date: new Date(),
        })
        .eq('user_id', this.user!.id);
    } catch (error) {
      console.error('Error resetting streak:', error);
    }
  }

  private isToday(date: Date): boolean {
    const today = new Date();
    return date.getDate() === today.getDate()
      && date.getMonth() === today.getMonth()
      && date.getFullYear() === today.getFullYear();
  }

  private isYesterday(date: Date): boolean {
    const today = new Date();
    const yesterday = new Date(today);
    yesterday.setDate(today.getDate() - 1);
    return date.getDate() === yesterday.getDate()
      && date.getMonth() === yesterday.getMonth()
      && date.getFullYear() === yesterday.getFullYear();
  }
}
