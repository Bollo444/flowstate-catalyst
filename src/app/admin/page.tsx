"use client";

import { useUser } from "@supabase/auth-helpers-react";
import { redirect } from "next/navigation";

export default function AdminPage() {
  const user = useUser();

  // Redirect if not admin
  if (user?.user_metadata?.role !== "admin") {
    redirect("/");
  }

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold">Admin Dashboard</h1>
      <p className="mt-4">
        Welcome to the admin dashboard. Manage users and roles here.
      </p>
    </div>
  );
}
