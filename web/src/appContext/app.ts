import type { inferProcedureOutput } from "@trpc/server";
import { createContext } from "react";

import type { Interval } from "@/interval";
import type { AppRouter } from "@/trpc";

export interface AppContext {
  startDate: number;
  dateDelimiter: Interval;
  dateItemHeight: number;
  assets: inferProcedureOutput<AppRouter["assets"]["list"]>;
  bookings: inferProcedureOutput<AppRouter["bookings"]["list"]>;
  scroll: (params: {
    toDate: number;
    fromDate?: number;
    behavior?: ScrollBehavior;
  }) => Promise<void>;
  scrollPositionMs: () => number;
  dateToY: (ts: number, params?: Partial<AppContext>) => number;
  dates: number[];
  scrollableContainerRef: React.RefObject<HTMLElement>;
}
export const appContext = createContext<AppContext | null>(null);
