import { createFileRoute } from "@tanstack/react-router";
import { useCallback, useEffect, useRef, useState } from "react";
import { z } from "zod";

import { app } from "@/app/app";
import {
  dateFromISO,
  dateSchema,
  dateToISO,
  getDates,
  roundDate,
} from "@/dates";
import { Interval } from "@/interval";
import { AssetsBookings } from "@/pages/Bookings";

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

const DEFAULT_SCROLL_BEHAVIOR = "smooth" satisfies ScrollBehavior;
function Index() {
  const navigate = Route.useNavigate();
  const { date: rawDate } = Route.useSearch();
  const isoDate = dateToISO(rawDate);
  const date = new Date(isoDate).getTime();

  const [maxItemsCount, setMaxItemsCount] = useState(100);
  const [dateItemHeight, setDateItemHeight] = useState(50);
  const [dateDelimiter, setDateDelimiter] = useState(Interval.HOUR);

  const getStartDateFor = useCallback(
    (ts: number) =>
      roundDate(ts - maxItemsCount * dateDelimiter, dateDelimiter),
    [dateDelimiter, maxItemsCount],
  );

  const minItemsCount = 2 * Math.ceil(window.outerHeight / dateItemHeight);

  if (maxItemsCount < minItemsCount) {
    // TODO refactor
    throw new Error(
      `maxItemsCount should be greater than or equal to ${minItemsCount}`,
    );
  }

  const startDate = getStartDateFor(date);
  const endDate = startDate + 2 * maxItemsCount * dateDelimiter;

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

  const scrollBehaviorRef = useRef<ScrollBehavior>(DEFAULT_SCROLL_BEHAVIOR);
  useEffect(() => {
    if (!scrollableContainerRef.current) return;

    scrollableContainerRef.current.scrollTo({
      top: dateToY(prevDateRef.current),
      behavior: "instant",
    });
    scrollableContainerRef.current.scrollTo({
      top: dateToY(date),
      behavior: scrollBehaviorRef.current,
    });
    scrollBehaviorRef.current = DEFAULT_SCROLL_BEHAVIOR;
    prevDateRef.current = date;
  }, [date, dateToY]);

  function preload() {
    if (!scrollableContainerRef.current) return;
    const currDate = yToDate(scrollableContainerRef.current.scrollTop);
    scrollBehaviorRef.current = "instant";
    void navigate({
      search: { date: dateFromISO(new Date(currDate).toISOString()) },
    });
  }
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
        preload,
      }}
    >
      <AssetsBookings />
    </app.Provider>
  );
}
