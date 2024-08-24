import { z } from "zod";

export const intervalSchema = z.number().brand<"Interval">();
export type Interval = z.infer<typeof intervalSchema>;
const MILLISECOND = 1 as Interval;
const SECOND = (1000 * MILLISECOND) as Interval;
const MINUTE = (60 * SECOND) as Interval;
const HOUR = (60 * MINUTE) as Interval;
const DAY = (24 * HOUR) as Interval;
const WEEK = (7 * DAY) as Interval;
// eslint-disable-next-line @typescript-eslint/no-redeclare
export const Interval = {
  MILLISECOND,
  SECOND,
  MINUTE,
  HOUR,
  DAY,
  WEEK, // TODO it is seven days
} as const;
export const IntervalMap = Object.entries(Interval).reduce<
  Record<Interval, string>
>((acc, [key, value]) => ({ ...acc, [value]: key }), {});
