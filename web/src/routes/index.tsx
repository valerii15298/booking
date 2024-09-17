import { createFileRoute } from "@tanstack/react-router";
import { useCallback, useEffect, useRef, useState } from "react";
import { z } from "zod";

import { AppDate, getDates, roundDate, tzOffset } from "@/atoms/dates";
import { Interval } from "@/atoms/interval";
import type { MenuPosition } from "@/features/app/app";
import { app } from "@/features/app/app";
import { AssetsBookings } from "@/features/Bookings";

const validateSearch = z.object({
  date: AppDate.urlFriendlySchema.optional().catch(undefined),
  focusBookingId: z.number().optional().catch(undefined),
});

function isEdgeScroll(el: HTMLDivElement) {
  const SHIFT = 100; // TODO calculate based on scrollableContainer height
  return (
    el.scrollTop < SHIFT ||
    el.scrollTop + el.clientHeight > el.scrollHeight - SHIFT
  );
}

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
  const [_, rerenderRaw] = useState(false);
  const rerender = useCallback(() => {
    rerenderRaw((a) => !a);
  }, []);

  const [menuPosition, setMenuPosition] = useState<MenuPosition>(
    isMobile ? "bottom" : "bottom", // TODO top navbar functionality
  );
  const navigate = Route.useNavigate();
  const { date: rawDate } = Route.useSearch();
  const date = rawDate
    ? AppDate.fromUrlFriendly(rawDate).getTime()
    : Date.now();

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
    [dateDelimiter.value, dateItemHeight, startDate],
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
      search: { date: new AppDate(currDate).toUrlFriendly() },
    });
  }, [navigate, yToDate]);

  const prevDateRef = useRef(date);
  const ignoreScrollEventRef = useRef(false);
  useEffect(() => {
    if (!scrollableContainerRef.current) return;
    const scrollableContainer = scrollableContainerRef.current;

    ignoreScrollEventRef.current = true;
    scrollableContainer.scrollTo({
      top: dateToY(prevDateRef.current),
      behavior: "instant",
    });
    scrollableContainer.scrollTo({
      top: dateToY(date),
      behavior: scrollBehaviorRef.current,
    });

    function checkProgrammaticScrollEnd() {
      if (!isEdgeScroll(scrollableContainer)) {
        ignoreScrollEventRef.current = false;
        scrollableContainer.removeEventListener(
          "scroll",
          checkProgrammaticScrollEnd,
        );
      }
    }
    scrollableContainer.addEventListener("scroll", checkProgrammaticScrollEnd);

    scrollableContainer.style.overflow = "";
    scrollBehaviorRef.current = DEFAULT_SCROLL_BEHAVIOR;
    prevDateRef.current = date;

    function onScroll() {
      if (ignoreScrollEventRef.current) return;

      prevDateRef.current = yToDate(scrollableContainer.scrollTop);

      if (isEdgeScroll(scrollableContainer)) {
        preload();
      }
    }
    scrollableContainer.addEventListener("scroll", onScroll);
    return () => {
      scrollableContainer.removeEventListener("scroll", onScroll);
    };
  }, [date, dateToY, preload, yToDate]);

  return (
    <app.Provider
      value={{
        rerender,
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
