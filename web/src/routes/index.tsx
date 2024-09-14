import { createFileRoute } from "@tanstack/react-router";
import { useCallback, useEffect, useRef, useState } from "react";
import { z } from "zod";

import {
  dateFromISO,
  dateSchema,
  dateToISO,
  getDates,
  roundDate,
  tzOffset,
} from "@/atoms/dates";
import { Interval } from "@/atoms/interval";
import type { MenuPosition } from "@/features/app/app";
import { app } from "@/features/app/app";
import { AssetsBookings } from "@/features/Bookings";

const validateSearch = z.object({
  date: dateSchema.optional().catch(undefined),
  focusBookingId: z.number().optional().catch(undefined),
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
const isMobile = /iPhone|iPad|iPod|Android/iu.test(navigator.userAgent);
function Index() {
  const [menuPosition, setMenuPosition] = useState<MenuPosition>(
    isMobile ? "bottom" : "top",
  );
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
  const [dateDelimiter, setDateDelimiter] = useState<Interval>(Interval.Hour);

  const getStartDateFor = useCallback(
    (ts: number) =>
      roundDate(ts - PRELOAD_COUNT * dateDelimiter.value, dateDelimiter.value) +
      tzOffset * (dateDelimiter.value >= Interval.Day.value ? 1 : 0),
    [dateDelimiter],
  );

  const startDate = getStartDateFor(date);
  const endDate = startDate + 2 * PRELOAD_COUNT * dateDelimiter.value;

  const dates = getDates(startDate, endDate, dateDelimiter.value);

  const dateToY = useCallback(
    (ts: number) =>
      // (date milliseconds diff) multiple by (pixels per millisecond ratio)
      ((ts - startDate) * dateItemHeight) / dateDelimiter.value,
    [dateDelimiter.value, dateItemHeight, startDate],
  );

  const yToDate = useCallback(
    (y: number) =>
      // startDate + milliseconds diff
      // startDate + ((pixels diff) multiple by (milliseconds per pixel ratio))
      startDate + (y * dateDelimiter.value) / dateItemHeight,
    [dateDelimiter, dateItemHeight, startDate],
  );

  const scrollableContainerRef = useRef<HTMLDivElement | null>(null);
  const scrollBehaviorRef = useRef<ScrollBehavior>(DEFAULT_SCROLL_BEHAVIOR);
  const preload = useCallback(() => {
    if (!scrollableContainerRef.current) return;
    if (isMobile) scrollableContainerRef.current.style.overflow = "hidden";

    const currDate = yToDate(scrollableContainerRef.current.scrollTop);
    scrollBehaviorRef.current = "instant";
    // TODO return promise here
    void navigate({
      search: { date: dateFromISO(new Date(currDate).toISOString()) },
    });
  }, [navigate, yToDate]);

  const prevDateRef = useRef(date);
  useEffect(() => {
    if (!scrollableContainerRef.current) return;
    const scrollableContainer = scrollableContainerRef.current;
    function onScroll() {
      prevDateRef.current = yToDate(scrollableContainer.scrollTop);

      const SHIFT = 400; // TODO calculate based on scrollableContainer height
      if (
        scrollableContainer.scrollTop < SHIFT ||
        scrollableContainer.scrollTop + scrollableContainer.clientHeight >
          scrollableContainer.scrollHeight - SHIFT
      ) {
        preload();
      }
    }
    scrollableContainer.addEventListener("scroll", onScroll);
    return () => {
      scrollableContainer.removeEventListener("scroll", onScroll);
    };
  }, [preload, yToDate]);

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
    scrollableContainerRef.current.style.overflow = "";
    scrollBehaviorRef.current = DEFAULT_SCROLL_BEHAVIOR;
    prevDateRef.current = date;
  }, [date, dateToY]);

  return (
    <app.Provider
      value={{
        startDate,
        endDate,
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
        menuPosition,
        setMenuPosition,
      }}
    >
      <AssetsBookings />
    </app.Provider>
  );
}
