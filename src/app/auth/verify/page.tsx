"use client";

import Link from "next/link";
import styles from "@/components/auth/Auth.module.css";

export default function VerifyPage() {
  return (
    <div className={styles.authContainer}>
      <div className={styles.authCard}>
        <h2>Check Your Email</h2>
        <div className={styles.verifyMessage}>
          <p>
            We've sent you an email with a verification link. Please check your
            inbox and click the link to verify your account.
          </p>
          <p>Once verified, you'll be able to sign in to your account.</p>
        </div>
        <div className={styles.switchAuth}>
          <Link href="/auth/signin">Return to Sign In</Link>
        </div>
      </div>
    </div>
  );
}
