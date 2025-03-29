"use client";

import { ReactNode } from "react";
import { SessionProvider } from "next-auth/react";
import { ThemeProviderWrapper } from "./theme-provider";

interface ClientProvidersProps {
  children: ReactNode;
  session: any;
}

export function ClientProviders({ children, session }: ClientProvidersProps) {
  return (
    <SessionProvider session={session}>
      <ThemeProviderWrapper>{children}</ThemeProviderWrapper>
    </SessionProvider>
  );
}
