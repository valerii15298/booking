import { useContext } from "react";

import { app } from "./app";

export function useApp() {
  const ctx = useContext(app);
  if (!ctx) {
    throw new Error("useApp() should be called inside of a app.Provider");
  }
  return ctx;
}
