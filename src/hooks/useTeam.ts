"use client";

import { useCallback, useEffect, useState } from "react";
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs";
import { Database } from "../types/database";
import { useToast } from "@/components/ui/use-toast";

export type Team = {
  id: string;
  name: string;
  description: string | null;
  created_at: string;
  updated_at: string;
};

export type TeamMember = {
  user_id: string;
  team_id: string;
  role: string;
  joined_at: string;
  profile: {
    name: string | null;
    avatar_url: string | null;
  };
};

export type TeamInvite = {
  id: string;
  team_id: string;
  inviter_id: string;
  invitee_email: string;
  role: string;
  created_at: string;
  expires_at: string;
};

export function useTeam(teamId?: string) {
  const [team, setTeam] = useState<Team | null>(null);
  const [members, setMembers] = useState<TeamMember[]>([]);
  const [invites, setInvites] = useState<TeamInvite[]>([]);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  const supabase = createClientComponentClient<Database>();

  const fetchTeam = useCallback(async () => {
    if (!teamId) return;

    try {
      const { data: team, error: teamError } = await supabase
        .from("teams")
        .select("*")
        .eq("id", teamId)
        .single();

      if (teamError) throw teamError;

      const { data: members, error: membersError } = await supabase
        .from("team_members")
        .select(
          `
          user_id,
          team_id,
          role,
          joined_at,
          profiles (
            name,
            avatar_url
          )
        `
        )
        .eq("team_id", teamId);

      if (membersError) throw membersError;

      const { data: invites, error: invitesError } = await supabase
        .from("team_invites")
        .select("*")
        .eq("team_id", teamId);

      if (invitesError) throw invitesError;

      setTeam(team);
      setMembers(
        members.map((member) => ({
          user_id: member.user_id,
          team_id: member.team_id,
          role: member.role,
          joined_at: member.joined_at,
          profile: {
            name: member.profiles[0].name,
            avatar_url: member.profiles[0].avatar_url,
          },
        }))
      );
      setInvites(invites);
    } catch (error) {
      console.error("Error fetching team:", error);
      toast({
        title: "Error",
        description: "Failed to fetch team data",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  }, [teamId, supabase, toast]);

  const createTeam = async (name: string, description?: string) => {
    try {
      const { data: team, error: teamError } = await supabase
        .from("teams")
        .insert([{ name, description }])
        .select()
        .single();

      if (teamError) throw teamError;

      // Add creator as admin
      const { error: memberError } = await supabase
        .from("team_members")
        .insert([
          {
            team_id: team.id,
            user_id: (await supabase.auth.getUser()).data.user?.id,
            role: "admin",
          },
        ]);

      if (memberError) throw memberError;

      toast({
        title: "Success",
        description: "Team created successfully",
      });

      return team;
    } catch (error) {
      console.error("Error creating team:", error);
      toast({
        title: "Error",
        description: "Failed to create team",
        variant: "destructive",
      });
      return null;
    }
  };

  const inviteMember = async (email: string, role: string = "member") => {
    if (!teamId) return null;

    try {
      const { data: invite, error } = await supabase
        .from("team_invites")
        .insert([
          {
            team_id: teamId,
            inviter_id: (await supabase.auth.getUser()).data.user?.id,
            invitee_email: email,
            role,
          },
        ])
        .select()
        .single();

      if (error) throw error;

      setInvites((prev) => [...prev, invite]);
      toast({
        title: "Success",
        description: `Invitation sent to ${email}`,
      });

      return invite;
    } catch (error) {
      console.error("Error inviting member:", error);
      toast({
        title: "Error",
        description: "Failed to send invitation",
        variant: "destructive",
      });
      return null;
    }
  };

  const removeMember = async (userId: string) => {
    if (!teamId) return false;

    try {
      const { error } = await supabase
        .from("team_members")
        .delete()
        .match({ team_id: teamId, user_id: userId });

      if (error) throw error;

      setMembers((prev) => prev.filter((member) => member.user_id !== userId));
      toast({
        title: "Success",
        description: "Team member removed",
      });

      return true;
    } catch (error) {
      console.error("Error removing member:", error);
      toast({
        title: "Error",
        description: "Failed to remove team member",
        variant: "destructive",
      });
      return false;
    }
  };

  const updateTeam = async (updates: Partial<Team>) => {
    if (!teamId) return null;

    try {
      const { data: team, error } = await supabase
        .from("teams")
        .update(updates)
        .eq("id", teamId)
        .select()
        .single();

      if (error) throw error;

      setTeam((prev) => (prev ? { ...prev, ...updates } : null));
      toast({
        title: "Success",
        description: "Team updated successfully",
      });

      return team;
    } catch (error) {
      console.error("Error updating team:", error);
      toast({
        title: "Error",
        description: "Failed to update team",
        variant: "destructive",
      });
      return null;
    }
  };

  useEffect(() => {
    fetchTeam();
  }, [fetchTeam]);

  return {
    team,
    members,
    invites,
    loading,
    createTeam,
    inviteMember,
    removeMember,
    updateTeam,
    refreshTeam: fetchTeam,
  };
}
