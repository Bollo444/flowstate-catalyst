'use client';

import { useState } from 'react';
import Image from 'next/image';
import { useSupabase } from '@/lib/supabaseClient';
import { Tables } from '@/types/database';
import styles from './Profile.module.css';

interface ProfileEditorProps {
  initialProfile: Tables<'profiles'>;
}

export function ProfileEditor({ initialProfile }: ProfileEditorProps) {
  const { supabase } = useSupabase();
  const [profile, setProfile] = useState(initialProfile);
  const [avatar, setAvatar] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  const handleAvatarChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.size > 2 * 1024 * 1024) { // 2MB limit
      setError('Image size should be less than 2MB');
      return;
    }

    setAvatar(file);
  };

  const handleProfileUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSuccess(false);
    setLoading(true);

    try {
      // Upload avatar if changed
      let avatarUrl = profile.avatar_url;
      if (avatar) {
        const fileExt = avatar.name.split('.').pop();
        const filePath = `${profile.id}/avatar.${fileExt}`;

        const { error: uploadError, data } = await supabase.storage
          .from('avatars')
          .upload(filePath, avatar, { upsert: true });

        if (uploadError) throw uploadError;

        const { data: { publicUrl } } = supabase.storage
          .from('avatars')
          .getPublicUrl(filePath);

        avatarUrl = publicUrl;
      }

      // Update profile
      const { error: updateError } = await supabase
        .from('profiles')
        .update({
          ...profile,
          avatar_url: avatarUrl,
          updated_at: new Date().toISOString()
        })
        .eq('id', profile.id);

      if (updateError) throw updateError;

      setSuccess(true);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={styles.profileEditor}>
      <form onSubmit={handleProfileUpdate} className={styles.form}>
        {error && <div className={styles.error}>{error}</div>}
        {success && <div className={styles.success}>Profile updated successfully</div>}
        
        <div className={styles.avatarSection}>
          <div className={styles.avatarWrapper}>
            {profile.avatar_url ? (
              <Image
                src={profile.avatar_url}
                alt="Profile avatar"
                width={100}
                height={100}
                className={styles.avatar}
              />
            ) : (
              <div className={styles.avatarPlaceholder}>
                {profile.name?.[0]?.toUpperCase() || '?'}
              </div>
            )}
          </div>
          <div className={styles.avatarUpload}>
            <input
              type="file"
              accept="image/*"
              onChange={handleAvatarChange}
              className={styles.fileInput}
              id="avatar"
            />
            <label htmlFor="avatar" className={styles.uploadButton}>
              Choose Image
            </label>
            {avatar && <span className={styles.fileName}>{avatar.name}</span>}
          </div>
        </div>

        <div className={styles.inputGroup}>
          <label htmlFor="name">Name</label>
          <input
            id="name"
            type="text"
            value={profile.name || ''}
            onChange={(e) => setProfile({ ...profile, name: e.target.value })}
            placeholder="Enter your name"
          />
        </div>

        <div className={styles.inputGroup}>
          <label htmlFor="bio">Bio</label>
          <textarea
            id="bio"
            value={profile.bio || ''}
            onChange={(e) => setProfile({ ...profile, bio: e.target.value })}
            placeholder="Tell us about yourself"
            rows={3}
          />
        </div>

        <div className={styles.inputGroup}>
          <label htmlFor="phone">Phone Number</label>
          <input
            id="phone"
            type="tel"
            value={profile.phone_number || ''}
            onChange={(e) => setProfile({ ...profile, phone_number: e.target.value })}
            placeholder="Enter your phone number"
          />
        </div>

        <button type="submit" disabled={loading} className={styles.submitButton}>
          {loading ? 'Saving...' : 'Save Changes'}
        </button>
      </form>
    </div>
  );
}

export default ProfileEditor;
