import { Suspense } from "react";
import { cookies } from "next/headers";
import { createServerComponentClient } from "@supabase/auth-helpers-nextjs";
import { redirect } from "next/navigation";
import { LoadingSpinner } from "../../components/shared/LoadingSpinner";
import FlowManager from "./flow-manager";

export const metadata = {
  title: "Flow Management - FlowState Catalyst",
  description:
    "Optimize your tasks based on your current flow state and work patterns",
};

async function getSession() {
  const cookieStore = cookies();
  const supabase = createServerComponentClient({
    cookies: () => cookieStore,
  });

  const {
    data: { session },
  } = await supabase.auth.getSession();
  return session;
}

export default async function FlowPage() {
  const session = await getSession();

  if (!session) {
    redirect("/auth/signin?redirect=/flow");
  }

  return (
    <Suspense
      fallback={
        <div className="flex items-center justify-center min-h-screen">
          <LoadingSpinner size="large" />
        </div>
      }
    >
      <FlowManager />
    </Suspense>
  );
}
