import { createContext } from "react";

import type { Interval } from "@/interval";

export interface App {
  startDate: number;
  dateDelimiter: Interval;
  dateItemHeight: number;
  dateToY: (ts: number) => number;
  yToDate: (y: number) => number;
  dates: number[];
  scrollableContainerRef: React.RefObject<HTMLElement>;
}
export const app = createContext<App | null>(null);
