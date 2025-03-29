"use client";

import { useState } from "react";
import { Provider } from "@supabase/supabase-js";
import { supabase } from "@/lib/supabaseClient";
import styles from "./Auth.module.css";

const providers = [
  { id: "google", name: "Google", icon: "🔍" },
  { id: "github", name: "GitHub", icon: "🐱" },
  { id: "discord", name: "Discord", icon: "💬" },
] as const;

interface SocialLoginProps {
  redirectTo?: string;
}

export function SocialLogin({ redirectTo = "/" }: SocialLoginProps) {
  const [loading, setLoading] = useState<Provider | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleSocialLogin = async (provider: Provider) => {
    try {
      setLoading(provider);
      setError(null);

      const { error } = await supabase.auth.signInWithOAuth({
        provider,
        options: {
          redirectTo: `${location.origin}/auth/callback?next=${redirectTo}`,
          queryParams: {
            access_type: "offline",
            prompt: "consent",
          },
        },
      });

      if (error) throw error;
    } catch (error) {
      setError(error instanceof Error ? error.message : "An error occurred");
    } finally {
      setLoading(null);
    }
  };

  return (
    <div className={styles.socialLogin}>
      {error && <div className={styles.error}>{error}</div>}
      <div className={styles.divider}>
        <span>Or continue with</span>
      </div>
      <div className={styles.socialButtons}>
        {providers.map((provider) => (
          <button
            key={provider.id}
            onClick={() => handleSocialLogin(provider.id as Provider)}
            disabled={loading !== null}
            className={`${styles.socialButton} ${
              loading === provider.id ? styles.loading : ""
            }`}
          >
            <span className={styles.socialIcon}>{provider.icon}</span>
            {loading === provider.id ? "Connecting..." : provider.name}
          </button>
        ))}
      </div>
    </div>
  );
}

export default SocialLogin;
