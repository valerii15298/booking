import type { inferProcedureOutput } from "@trpc/server";
import { createContext } from "react";

import type { AppRouter } from "@/trpc";

import type { UseState } from "../lib/types";

export type AppContext = UseState<number, "dateItemHeight"> &
  UseState<number[], "columnsSizes"> &
  UseState<number, "dateDelimiter"> &
  UseState<number, "preloadDateInterval"> &
  UseState<number, "startDate"> &
  UseState<number, "endDate"> & {
    assets: inferProcedureOutput<AppRouter["assets"]["list"]>;
    bookings: inferProcedureOutput<AppRouter["bookings"]["list"]>;
    scroll: (params: {
      toDate: number;
      fromDate?: number;
      behavior?: ScrollBehavior;
    }) => void;
    scrollPositionMs: () => number;
    dateToY: (ts: number, params?: Partial<AppContext>) => number;
    dates: number[];
    scrollableContainerHeight: number;
    scrollableContainerRef: React.RefObject<HTMLDivElement>;
  };
export const appContext = createContext<AppContext | null>(null);
