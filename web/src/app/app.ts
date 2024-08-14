import { createContext } from "react";

import type { Interval } from "@/interval";
import type { UseState } from "@/lib/types";

export type App = {
  dateDelimiter: Interval;
  dateItemHeight: number;
  dateToY: (ts: number) => number;
  yToDate: (y: number) => number;
  dates: number[];
  scrollableContainerRef: React.RefObject<HTMLElement>;
  preload: () => void;
} & UseState<number, "maxItemsCount"> &
  UseState<number, "dateItemHeight"> &
  UseState<Interval, "dateDelimiter">;

export const app = createContext<App | null>(null);
