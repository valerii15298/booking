import type { inferProcedureOutput } from "@trpc/server";
import type { RefObject } from "react";
import { createContext } from "react";

import type { AppRouter } from "@/trpc";

import type { UseState } from "../lib/types";

type AppContext = UseState<number, "dateItemHeight"> &
  UseState<number, "scrollHeight"> &
  UseState<number[], "columnsSizes"> &
  UseState<number, "startDate"> &
  UseState<number, "endDate"> & { dateToY: (ts: number) => number } & {
    assets: inferProcedureOutput<AppRouter["assets"]["list"]>;
    bookings: inferProcedureOutput<AppRouter["bookings"]["list"]>;
    scrollableContainerRef: RefObject<HTMLDivElement>;
  };
export const appContext = createContext<AppContext | null>(null);
