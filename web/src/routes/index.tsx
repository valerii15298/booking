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
} from "@/atoms/dates";
import { Interval } from "@/atoms/interval";
import { AssetsBookings } from "@/pages/Bookings";

const validateSearch = z.object({
  date: dateSchema.optional().catch(undefined),
  selectedBookingId: z.number().optional().catch(undefined),
});

export const Route = createFileRoute("/")({
  // eslint-disable-next-line @typescript-eslint/no-use-before-define
  component: Index,
  validateSearch,
  loader: async (c) => c.context.utils.assets.list.ensureData(),
});

const DEFAULT_SCROLL_BEHAVIOR = "smooth" satisfies ScrollBehavior;
const PRELOAD_COUNT = 100;
const DEFAULT_DATE_ITEM_HEIGHT = 50;
function Index() {
  const navigate = Route.useNavigate();
  const { date: rawDate } = Route.useSearch();
  const date = rawDate ? new Date(dateToISO(rawDate)).getTime() : Date.now();

  const maxDateItemHeight = Math.floor(window.innerHeight / 3);
  const minDateItemHeight = Math.max(
    Math.ceil(window.innerHeight / PRELOAD_COUNT),
    20,
  );
  const [dateItemHeight, setDateItemHeight] = useState(
    Math.max(
      minDateItemHeight,
      Math.min(DEFAULT_DATE_ITEM_HEIGHT, maxDateItemHeight),
    ),
  );
  const [dateDelimiter, setDateDelimiter] = useState(Interval.HOUR);

  const getStartDateFor = useCallback(
    (ts: number) =>
      roundDate(ts - PRELOAD_COUNT * dateDelimiter, dateDelimiter),
    [dateDelimiter],
  );

  const startDate = getStartDateFor(date);
  const endDate = startDate + 2 * PRELOAD_COUNT * dateDelimiter;

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
        dateItemHeight,
        maxDateItemHeight,
        minDateItemHeight,
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
