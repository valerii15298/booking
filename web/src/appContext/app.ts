import type { inferProcedureOutput } from "@trpc/server";
import { createContext } from "react";

import type { AppRouter } from "@/trpc";

import type { UseState } from "../lib/types";

type AppContext = UseState<number, "dateItemHeight"> &
  UseState<number[], "columnsSizes"> &
  UseState<number, "dateDelimiter"> &
  UseState<number, "startDate"> &
  UseState<number, "endDate"> & {
    assets: inferProcedureOutput<AppRouter["assets"]["list"]>;
    bookings: inferProcedureOutput<AppRouter["bookings"]["list"]>;
    scrollToDate: (ts: number) => void;
    dateToY: (ts: number) => number;
    dates: number[];
    scrollableContainerHeight: number;
    scrollableContainerRef: React.RefObject<HTMLDivElement>;
  };
export const appContext = createContext<AppContext | null>(null);
