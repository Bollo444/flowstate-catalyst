import { ReactNode } from "react";
import { cookies } from "next/headers";
import { createServerClient, type CookieOptions } from "@supabase/ssr"; // Use correct import
import { Providers } from "./providers";
import { Database } from "../types/database";
import Sidebar from "@/components/layout/Sidebar"; // Re-add Sidebar import

import "./globals.css";

import type { Viewport } from "next";

export const metadata = {
  title: "FlowState Catalyst",
  description: "Optimize your workflow with flow state-based task management",
  icons: {
    icon: "/favicon.ico",
  },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
};

export default async function RootLayout({
  children,
}: {
  children: ReactNode;
}) {
  const cookieStore = cookies();

  // Correctly structure createServerClient call for Server Components
  const supabase = createServerClient<Database>(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        get(name: string) {
          return cookieStore.get(name)?.value;
        },
        set(name: string, value: string, options: CookieOptions) {
          try {
            cookieStore.set({ name, value, ...options });
          } catch (error) {
            // The `set` method was called from a Server Component.
            // This can be ignored if you have middleware refreshing
            // user sessions.
          }
        },
        remove(name: string, options: CookieOptions) {
          try {
            cookieStore.set({ name, value: "", ...options });
          } catch (error) {
            // The `delete` method was called from a Server Component.
            // This can be ignored if you have middleware refreshing
            // user sessions.
          }
        },
      },
    }
  );

  const {
    // data, // data is unused now, only error is checked
    error,
  } = await supabase.auth.getUser();
  if (error) {
    console.error("Error getting user in RootLayout:", error);
  }

  // const teamId = user?.user_metadata?.team_id; // Example

  return (
    <html lang="en">
      <body className="flex bg-background-light text-foreground-light dark:bg-background-dark dark:text-foreground-dark">
        <Sidebar />
        <main className="flex-1 p-4 ml-64">
          <Providers /* teamId={teamId} */>{children}</Providers>
        </main>
      </body>
    </html>
  );
}
