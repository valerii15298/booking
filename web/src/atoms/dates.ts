import { z } from "zod";

import type { IntervalBrand } from "@/atoms/interval";

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

export function roundDate(ts: number, interval: IntervalBrand) {
  return Math.round(ts / interval) * interval;
}

export function getDates(
  startDate: number,
  endDate: number,
  dateDelimiter: IntervalBrand,
) {
  const dates = [];
  let currentDate = startDate;
  while (currentDate < endDate) {
    currentDate += dateDelimiter;
    dates.push(currentDate);
  }
  return dates;
}

// for input type="date"
export function formatDate(date: Date) {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");

  return `${year}-${month}-${day}` as const;
}

// for input type="datetime-local"
export function formatDateTime(date: Date) {
  const dateStr = formatDate(date);
  const hours = String(date.getHours()).padStart(2, "0");
  const minutes = String(date.getMinutes()).padStart(2, "0");
  const seconds = String(date.getSeconds()).padStart(2, "0");
  const milliseconds = String(date.getMilliseconds()).padStart(3, "0");

  return `${dateStr}T${hours}:${minutes}:${seconds}.${milliseconds}` as const;
}

export function dateInfoWithPaddings(date: Date) {
  const year = date.getFullYear().toString();
  const month = (date.getMonth() + 1).toString().padStart(2, "0");
  const day = date.getDate().toString().padStart(2, "0");
  const hours = date.getHours().toString().padStart(2, "0");
  const minutes = date.getMinutes().toString().padStart(2, "0");
  const seconds = date.getSeconds().toString().padStart(2, "0");
  const milliseconds = date.getMilliseconds().toString().padStart(3, "0");
  return { year, month, day, hours, minutes, seconds, milliseconds };
}

/** when using days start of the day should be at 00:00:00.000 */
export const tzOffset = new Date().getTimezoneOffset() * 60 * 1000;
