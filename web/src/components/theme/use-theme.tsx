import { useContext } from "react";

import type { ThemeProviderState } from "./theme-provider";
import { ThemeProviderContext } from "./theme-provider";

export function useTheme() {
  const context = useContext(ThemeProviderContext) as
    | ThemeProviderState
    | undefined;

  if (context === undefined)
    throw new Error("useTheme must be used within a ThemeProvider");

  return context;
}
