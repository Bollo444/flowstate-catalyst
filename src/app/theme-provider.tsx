"use client";

import { ReactNode } from "react";
import { ThemeProvider } from "@emotion/react";
import { theme } from "../styles/theme";

interface ThemeProviderWrapperProps {
  children: ReactNode;
}

export function ThemeProviderWrapper({ children }: ThemeProviderWrapperProps) {
  return <ThemeProvider theme={theme}>{children}</ThemeProvider>;
}
