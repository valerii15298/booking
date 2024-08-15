import { z } from "zod";

import type { Interval } from "@/atoms/interval";

export function dateFromISO(str: string) {
  return str.split(".")[0]!.replaceAll(":", "-");
}

export function dateToISO(str: string) {
  const [date, time] = str.split("T");
  return `${date}T${time!.replaceAll("-", ":")}Z`;
}

export const dateSchema = z.string().refine(
  (v) => {
    const parsed = dateToISO(v);
    const date = new Date(parsed);
    return (
      date.getTime() && date.toISOString().split(".")[0] === parsed.slice(0, -1)
    );
  },
  {
    message: "Invalid date",
  },
);

export function roundDate(ts: number, interval: Interval) {
  return Math.round(ts / interval) * interval;
}

export function getDates(
  startDate: number,
  endDate: number,
  dateDelimiter: number,
) {
  const dates = [];
  let currentDate = startDate;
  while (currentDate < endDate) {
    dates.push(currentDate);
    currentDate += dateDelimiter;
  }
  return dates;
}
