import { createContext } from "react";

import type { Interval } from "@/atoms/interval";
import type { UseState } from "@/lib/types";

export type MenuPosition = "top" | "bottom";
export type App = {
  dateDelimiter: Interval;
  dateItemHeight: number;
  maxDateItemHeight: number;
  minDateItemHeight: number;
  dateToY: (ts: number) => number;
  yToDate: (y: number) => number;
  startDate: number;
  endDate: number;
  dates: number[];
  scrollableContainerRef: React.RefObject<HTMLElement>;
  preload: () => void;
} & UseState<number, "dateItemHeight"> &
  UseState<MenuPosition, "menuPosition"> &
  UseState<Interval, "dateDelimiter">;

export const app = createContext<App | null>(null);
