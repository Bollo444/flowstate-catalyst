"use client";

import { useState } from "react";
// import { useRouter } from "next/navigation"; // Unused import
import Link from "next/link";
import { supabase } from "@/lib/supabaseClient";
import styles from "./Auth.module.css";

export function ForgotPassword() {
  // const router = useRouter(); // Unused variable
  const [email, setEmail] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [message, setMessage] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleResetPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setMessage(null);
    setLoading(true);

    try {
      const { error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: `${location.origin}/auth/reset-password`,
      });

      if (error) throw error;

      setMessage("Check your email for the password reset link");
    } catch (error) {
      setError(error instanceof Error ? error.message : "An error occurred");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={styles.authContainer}>
      <div className={styles.authCard}>
        <h2>Reset Password</h2>
        {error && <div className={styles.error}>{error}</div>}
        {message && <div className={styles.success}>{message}</div>}
        <form onSubmit={handleResetPassword} className={styles.form}>
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
          <button type="submit" disabled={loading} className={styles.button}>
            {loading ? "Sending reset link..." : "Send Reset Link"}
          </button>
        </form>
        <div className={styles.switchAuth}>
          <Link href="/auth/signin">Back to Sign In</Link>
        </div>
      </div>
    </div>
  );
}

export default ForgotPassword;
