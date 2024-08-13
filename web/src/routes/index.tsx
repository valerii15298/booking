import { createFileRoute } from "@tanstack/react-router";
import { useCallback, useEffect, useRef } from "react";
import { z } from "zod";

import { appContext } from "@/appContext/app";
import { Interval, intervalSchema } from "@/interval";
import { AssetsBookings } from "@/pages/Bookings";

const validateSearch = z.object({
  maxItemsCount: z.number().catch(100),
  dateItemHeight: z.number().catch(50),
  dateDelimiter: intervalSchema.catch(Interval.HOUR),
  date: z.number().catch(Date.now()),
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
  const { date, dateDelimiter, dateItemHeight, maxItemsCount } =
    Route.useSearch();

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
    <appContext.Provider
      value={{
        dateDelimiter,
        dates,
        dateToY,
        yToDate,
        startDate,
        dateItemHeight,
        scrollableContainerRef,
      }}
    >
      <AssetsBookings />
    </appContext.Provider>
  );
}
