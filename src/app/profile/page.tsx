"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useSupabase } from "@/lib/supabaseClient";
import { ProfileEditor } from "@/components/profile/ProfileEditor";
// import { Tables } from "@/types/database"; // Removed as profile state uses 'any' for now
import styles from "./profile.module.css";

export default function ProfilePage() {
  const router = useRouter();
  const { supabase, session } = useSupabase();
  const [profile, setProfile] = useState<any | null>(null); // Use 'any' temporarily to fix build
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!session?.user) {
      router.push("/auth/signin");
      return;
    }

    const user = session.user;

    async function loadProfile() {
      try {
        const { data, error } = await supabase
          .from("profiles")
          .select("*")
          .eq("user_id", user.id)
          .single();

        if (error) throw error;

        if (data) {
          setProfile(data);
        } else {
          // Create profile if it doesn't exist
          const { data: newProfile, error: createError } = await supabase
            .from("profiles")
            .insert({
              id: user.id,
              user_id: user.id,
              email: user.email,
              created_at: new Date().toISOString(),
              updated_at: new Date().toISOString(),
            })
            .select()
            .single();

          if (createError) throw createError;
          setProfile(newProfile);
        }
      } catch (err) {
        setError(err instanceof Error ? err.message : "Failed to load profile");
      } finally {
        setLoading(false);
      }
    }

    loadProfile();
  }, [session, supabase, router]);

  if (!session) return null;

  if (loading) {
    return (
      <div className={styles.container}>
        <div className={styles.loading}>Loading profile...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className={styles.container}>
        <div className={styles.error}>
          {error}
          <button
            onClick={() => router.refresh()}
            className={styles.retryButton}
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  if (!profile) {
    return (
      <div className={styles.container}>
        <div className={styles.error}>Profile not found</div>
      </div>
    );
  }

  return (
    <div className={styles.container}>
      <h1 className={styles.heading}>Profile Settings</h1>
      <ProfileEditor initialProfile={profile} />
    </div>
  );
}
