/* eslint-disable react-refresh/only-export-components */
import type { ReactNode } from "react";
import type { z } from "zod";

import { dateInfoWithPaddings } from "./dates";

export type IntervalBrand = number & z.BRAND<"Interval">;

export type Interval = Readonly<{
  value: IntervalBrand;
  label: string;

  isBreakpoint: (date: Date) => boolean;
  breakpoint: (date: Date) => ReactNode;
  item: (date: Date) => ReactNode;

  prev: () => Interval;
}>;

const Millisecond = {
  value: 1 as IntervalBrand,
  label: "Millisecond",

  isBreakpoint: (date) =>
    date.getMilliseconds() === 0 && date.getSeconds() === 0,

  breakpoint: (date) => {
    const { month, day, hours, minutes } = dateInfoWithPaddings(date);
    return (
      <>
        <i>{`${day}/${month}`}</i>
        <b>{`${hours}:${minutes}`}</b>
      </>
    );
  },

  item: (date) => {
    const { seconds, milliseconds } = dateInfoWithPaddings(date);
    return `${seconds}.${milliseconds}`;
  },

  prev() {
    return this;
  },
} as const satisfies Interval;

const Second = {
  ...Millisecond,

  value: (Millisecond.value * 1000) as IntervalBrand,
  label: "Second",

  item: (date) => {
    const { minutes, seconds } = dateInfoWithPaddings(date);
    return `${minutes}:${seconds}`;
  },

  prev() {
    return Millisecond;
  },
} as const satisfies Interval;

const Minute = {
  value: (Second.value * 60) as IntervalBrand,
  label: "Minute",

  isBreakpoint: (date) => date.getMinutes() === 0 && date.getHours() === 0,

  breakpoint: (date) => {
    const { year, month, day } = dateInfoWithPaddings(date);
    return (
      <>
        <i>{year}</i>
        <b>{`${day}/${month}`}</b>
      </>
    );
  },

  item: (date) => {
    const { hours, minutes } = dateInfoWithPaddings(date);
    return `${hours}:${minutes}`;
  },

  prev() {
    return Second;
  },
} as const satisfies Interval;

const Hour = {
  ...Minute,
  value: (Minute.value * 60) as IntervalBrand,
  label: "Hour",
  prev() {
    return Minute;
  },
} as const satisfies Interval;

const Day = {
  value: (Hour.value * 24) as IntervalBrand,
  label: "Day",

  isBreakpoint: (date) => date.getDate() === 1,

  breakpoint: (date) => {
    const { year } = dateInfoWithPaddings(date);
    return (
      <>
        <i>{year}</i>
        <b>{date.toLocaleString("default", { month: "short" })}</b>
      </>
    );
  },

  item: (date) => {
    const { month, day } = dateInfoWithPaddings(date);
    return `${month}/${day}`;
  },

  prev() {
    return Hour;
  },
} as const satisfies Interval;

const Week = {
  ...Day,
  value: (Day.value * 7) as IntervalBrand,
  label: "Week",

  isBreakpoint: (date) => date.getDate() <= 7 && date.getMonth() === 0,

  breakpoint: (date) => {
    const { month, day, year } = dateInfoWithPaddings(date);
    return (
      <>
        <i>{`${month}/${day}`}</i>
        <b>{year}</b>
      </>
    );
  },

  prev() {
    return Day;
  },
} as const satisfies Interval;

// eslint-disable-next-line @typescript-eslint/no-redeclare
export const Interval = {
  Millisecond,
  Second,
  Minute,
  Hour,
  Day,
  Week,
};
