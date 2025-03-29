"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { supabase } from "@/lib/supabaseClient";
import { SocialLogin } from "./SocialLogin";
import { PasswordStrength } from "./PasswordStrength";
import styles from "./Auth.module.css";

export function SignUp() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleSignUp = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (password !== confirmPassword) {
      setError("Passwords do not match");
      return;
    }

    setLoading(true);

    try {
      const { error: signUpError, data } = await supabase.auth.signUp({
        email,
        password,
        options: {
          emailRedirectTo: `${location.origin}/auth/callback`,
        },
      });

      if (signUpError) throw signUpError;

      if (data.user) {
        // Create a profile for the new user
        const { error: profileError } = await supabase.from("profiles").insert({
          id: data.user.id,
          user_id: data.user.id,
          email: data.user.email,
        });

        if (profileError) throw profileError;
      }

      router.push("/auth/verify");
    } catch (error) {
      setError(error instanceof Error ? error.message : "An error occurred");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={styles.authContainer}>
      <div className={styles.authCard}>
        <h2>Create Account</h2>
        {error && <div className={styles.error}>{error}</div>}
        <form onSubmit={handleSignUp} className={styles.form}>
          <div className={styles.inputGroup}>
            <label htmlFor="email">Email</label>
            <input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Enter your email"
              required
            />
          </div>
          <div className={styles.inputGroup}>
            <label htmlFor="password">Password</label>
            <input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Enter your password"
              required
              minLength={6}
            />
            <PasswordStrength password={password} />
          </div>
          <div className={styles.inputGroup}>
            <label htmlFor="confirmPassword">Confirm Password</label>
            <input
              id="confirmPassword"
              type="password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              placeholder="Confirm your password"
              required
              minLength={6}
            />
          </div>
          <button type="submit" disabled={loading} className={styles.button}>
            {loading ? "Creating account..." : "Sign Up"}
          </button>
        </form>
        <p className={styles.switchAuth}>
          Already have an account? <Link href="/auth/signin">Sign in here</Link>
        </p>
        <SocialLogin redirectTo="/onboarding" />
      </div>
    </div>
  );
}

export default SignUp;
