"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { createClient } from "@/lib/supabase-client";
import { SocialLogin } from "./SocialLogin";
import styles from "./Auth.module.css";

// Unused interface
// interface AuthError {
//   message: string;
//   status?: number;
// }

export function SignIn() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const supabase = createClient();

  const handleSignIn = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      const { error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) throw error;
      router.push("/");
      router.refresh();
    } catch (error: unknown) {
      setError(
        error instanceof Error ? error.message : "An unexpected error occurred"
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={styles.authContainer}>
      <div className={styles.authCard}>
        <h2>Sign In</h2>
        {error && <div className={styles.error}>{error}</div>}
        <form onSubmit={handleSignIn} className={styles.form}>
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
            />
          </div>
          <div className={styles.forgotPassword}>
            <Link href="/auth/forgot-password">Forgot your password?</Link>
          </div>
          <button type="submit" disabled={loading} className={styles.button}>
            {loading ? "Signing in..." : "Sign In"}
          </button>
        </form>
        <p className={styles.switchAuth}>
          Don't have an account? <Link href="/auth/signup">Sign up here</Link>
        </p>
        <SocialLogin />
      </div>
    </div>
  );
}

export default SignIn;
