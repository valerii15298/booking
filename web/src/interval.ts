import { z } from "zod";

export const intervalSchema = z.number().brand<"Interval">();
export type Interval = z.infer<typeof intervalSchema>;
const SECOND = 1000 as Interval;
const MINUTE = (60 * SECOND) as Interval;
const HOUR = (60 * MINUTE) as Interval;
const DAY = (24 * HOUR) as Interval;
const WEEK = (7 * DAY) as Interval;
// eslint-disable-next-line @typescript-eslint/no-redeclare
export const Interval = { SECOND, MINUTE, HOUR, DAY, WEEK } as const;
