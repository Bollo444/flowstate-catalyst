"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { ForgotPassword } from "@/components/auth/ForgotPassword";
import { useSupabase } from "@/lib/supabaseClient";

export default function ForgotPasswordPage() {
  const router = useRouter();
  const { session } = useSupabase();

  useEffect(() => {
    if (session) {
      router.push("/");
    }
  }, [session, router]);

  return <ForgotPassword />;
}
