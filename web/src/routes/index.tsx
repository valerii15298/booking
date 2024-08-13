import { createFileRoute } from "@tanstack/react-router";
import { useCallback, useEffect, useRef, useState } from "react";
import { z } from "zod";

import { app } from "@/app/app";
import { Interval } from "@/interval";
import { AssetsBookings } from "@/pages/Bookings";

function dateFromISO(str: string) {
  return str.split(".")[0]!.replaceAll(":", "-");
}

function dateToISO(str: string) {
  const [date, time] = str.split("T");
  return `${date}T${time!.replaceAll("-", ":")}Z`;
}

const dateSchema = z.string().refine(
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

const validateSearch = z.object({
  date: dateSchema.catch(dateFromISO(new Date().toISOString())),
  selectedBookingId: z.number().optional().catch(undefined),
});

export const Route = createFileRoute("/")({
  // eslint-disable-next-line @typescript-eslint/no-use-before-define
  component: Index,
  validateSearch,
  loader: async (c) => c.context.utils.assets.list.ensureData(),
});

function roundDate(ts: number, interval: Interval) {
  return Math.round(ts / interval) * interval;
}

function getDates(startDate: number, endDate: number, dateDelimiter: number) {
  const dates = [];
  let currentDate = startDate;
  while (currentDate < endDate) {
    dates.push(currentDate);
    currentDate += dateDelimiter;
  }
  return dates;
}
function Index() {
  const { date: rawDate } = Route.useSearch();
  const isoDate = dateToISO(rawDate);
  const date = new Date(isoDate).getTime();

  const [maxItemsCount, setMaxItemsCount] = useState(100);
  const [dateItemHeight, setDateItemHeight] = useState(50);
  const [dateDelimiter, setDateDelimiter] = useState(Interval.HOUR);

  function getStartDateFor(ts: number) {
    return roundDate(ts - maxItemsCount * dateDelimiter, dateDelimiter);
  }

  const minItemsCount = 2 * Math.ceil(window.outerHeight / dateItemHeight);

  if (maxItemsCount < minItemsCount) {
    // TODO refactor
    throw new Error(
      `maxItemsCount should be greater than or equal to ${minItemsCount}`,
    );
  }

  const startDate = getStartDateFor(date);
  const endDate = roundDate(
    date + maxItemsCount * dateDelimiter,
    dateDelimiter,
  );

  const dates = getDates(startDate, endDate, dateDelimiter);

  const dateToY = useCallback(
    (ts: number) =>
      // (date milliseconds diff) multiple by (pixels per millisecond ratio)
      ((ts - startDate) * dateItemHeight) / dateDelimiter,
    [dateDelimiter, dateItemHeight, startDate],
  );

  const yToDate = useCallback(
    (y: number) =>
      // startDate + milliseconds diff
      // startDate + ((pixels diff) multiple by (milliseconds per pixel ratio))
      startDate + (y * dateDelimiter) / dateItemHeight,
    [dateDelimiter, dateItemHeight, startDate],
  );

  const scrollableContainerRef = useRef<HTMLDivElement | null>(null);

  const prevDateRef = useRef(date);

  useEffect(() => {
    if (!scrollableContainerRef.current) return;

    scrollableContainerRef.current.scrollTo({
      top: dateToY(prevDateRef.current),
      behavior: "instant",
    });
    scrollableContainerRef.current.scrollTo({
      top: dateToY(date),
      behavior: "smooth",
    });
    prevDateRef.current = date;
  }, [date, dateToY]);

  return (
    <app.Provider
      value={{
        dates,
        dateToY,
        yToDate,
        scrollableContainerRef,
        maxItemsCount,
        setMaxItemsCount,
        dateItemHeight,
        setDateItemHeight,
        dateDelimiter,
        setDateDelimiter,
      }}
    >
      <AssetsBookings />
    </app.Provider>
  );
}
