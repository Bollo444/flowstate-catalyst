"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { SignUp } from "@/components/auth/SignUp";
import { useSupabase } from "@/lib/supabaseClient";

export default function SignUpPage() {
  const router = useRouter();
  const { session } = useSupabase();

  useEffect(() => {
    if (session) {
      router.push("/");
    }
  }, [session, router]);

  return <SignUp />;
}
