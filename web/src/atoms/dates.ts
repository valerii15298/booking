import { z } from "zod";

import { Interval, type IntervalBrand } from "@/atoms/interval";

/** when using days start of the day should be at 00:00:00.000 */
export const tzOffset = new Date().getTimezoneOffset() * Interval.Minute.value;

const tzOffsetSign = tzOffset <= 0 ? "+" : "-";
const tzOffsetHours = Math.floor(Math.abs(tzOffset) / Interval.Hour.value);
const tzOffsetMinutes =
  (Math.abs(tzOffset) % Interval.Hour.value) / Interval.Minute.value;
const tzOffsetString = `${tzOffsetSign}${tzOffsetHours.toString().padStart(2, "0")}:${tzOffsetMinutes.toString().padStart(2, "0")}`;

const urlFriendlyDateSchema = z.string().brand("UrlFriendlyDate");
type UrlFriendlyDate = z.infer<typeof urlFriendlyDateSchema>;

export class AppDate extends Date {
  public static urlFriendlySchema = urlFriendlyDateSchema
    .refine(
      (v) => {
        const parsed = new AppDate(AppDate.fromUrlFriendlyToISO(v));
        const date = new AppDate(parsed);
        return (
          date.getTime() &&
          parsed.getTime() &&
          date.getTime() === parsed.getTime()
        );
      },
      {
        message: "Invalid url friendly date",
      },
    )
    .transform((v) => AppDate.fromUrlFriendly(v).toUrlFriendly());

  public static fromUrlFriendlyToISO(str: UrlFriendlyDate) {
    const [date, time] = str.split("T");

    return `${date}T${time?.replaceAll("-", ":")}`;
  }

  public static fromUrlFriendly(str: UrlFriendlyDate) {
    return new AppDate(AppDate.fromUrlFriendlyToISO(str));
  }

  public toUrlFriendly() {
    return this.toLocalISOString().replaceAll(":", "-") as UrlFriendlyDate;
  }

  public toLocalISOString(this: Date) {
    return `${new Date(this.getTime() - tzOffset).toISOString().split("Z")[0]}${tzOffsetString}`;
  }
}

const date = new AppDate();
// eslint-disable-next-line no-console
console.assert(
  AppDate.fromUrlFriendly(date.toUrlFriendly()).toUrlFriendly() ===
    date.toUrlFriendly(),
);
// eslint-disable-next-line no-console
console.assert(
  AppDate.fromUrlFriendly(date.toUrlFriendly()).getTime() ===
    new Date(AppDate.fromUrlFriendlyToISO(date.toUrlFriendly())).getTime(),
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
