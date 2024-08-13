import { createContext } from "react";

import type { Interval } from "@/interval";

export interface AppContext {
  startDate: number;
  dateDelimiter: Interval;
  dateItemHeight: number;
  dateToY: (ts: number) => number;
  yToDate: (y: number) => number;
  dates: number[];
  scrollableContainerRef: React.RefObject<HTMLElement>;
}
export const appContext = createContext<AppContext | null>(null);
