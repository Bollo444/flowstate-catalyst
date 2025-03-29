"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { ResetPassword } from "@/components/auth/ResetPassword";
import { useSupabase } from "@/lib/supabaseClient";

export default function ResetPasswordPage() {
  const router = useRouter();
  const { session } = useSupabase();

  useEffect(() => {
    if (session) {
      router.push("/");
    }
  }, [session, router]);

  return <ResetPassword />;
}
