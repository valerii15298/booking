import { useContext } from "react";

import { appContext } from "./app";

export function useApp() {
  const ctx = useContext(appContext);
  if (!ctx) {
    throw new Error("useApp() should be called inside of a AppProvider");
  }
  return ctx;
}
