import { useRef, useState } from "react";

import {
  getDates,
  getDefaultStartDate,
  HOUR_IN_MS,
  roundDateToHours,
} from "@/getDates";
import { trpc } from "@/trpc";

import type { AppContext } from "./app";
import { appContext } from "./app";

export function AppProvider({ children }: { children: React.ReactNode }) {
  const assetsQuery = trpc.assets.list.useQuery();
  const bookingsQuery = trpc.bookings.list.useQuery();

  const [columnsSizes, setColumnsSizes] = useState<number[]>([]);

  const [dateItemHeight, setDateItemHeight] = useState(50);
  const [dateDelimiter, setDateDelimiter] = useState(HOUR_IN_MS);
  const minDiffDateIntervalToFillWindow =
    Math.ceil(window.outerHeight / dateItemHeight) * dateDelimiter;
  const [preloadDateInterval, setPreloadDateInterval] = useState(
    2 * minDiffDateIntervalToFillWindow,
  );

  const [startDate, setStartDate] = useState(getDefaultStartDate);
  const [endDate, setEndDate] = useState(startDate + preloadDateInterval);

  const dates = getDates(startDate, endDate, dateDelimiter);
  const scrollableContainerHeight = dates.length * dateItemHeight;

  // eslint-disable-next-line func-style
  const dateToY: AppContext["dateToY"] = function dateToY(ts, params) {
    const p = {
      startDate,
      dateDelimiter,
      dateItemHeight,
      ...params,
    };
    // (date milliseconds diff) multiple by (pixels per millisecond ratio)
    return ((ts - p.startDate) * p.dateItemHeight) / p.dateDelimiter;
  };

  // TODO fix rule func-style which is currently set to ["error", "declaration"],
  // eslint-disable-next-line func-style
  const yToDate = function yToDate(y: number, params?: Partial<AppContext>) {
    const p = {
      startDate,
      dateDelimiter,
      dateItemHeight,
      ...params,
    };
    // startDate + milliseconds diff
    // startDate + ((pixels diff) multiple by (milliseconds per pixel ratio))
    return p.startDate + (y * p.dateDelimiter) / p.dateItemHeight;
  };

  const scrollableContainerRef = useRef<HTMLDivElement | null>(null);
  function scrollPositionMs() {
    return yToDate(scrollableContainerRef.current?.scrollTop ?? 0);
  }

  // if ((endDate - startDate) % dateDelimiter !== 0) {
  //   // eslint-disable-next-line no-console
  //   console.log((endDate - startDate) % dateDelimiter);
  //   console.error(
  //     `Error: (endDate - startDate) should be always dividable by dateDelimiter. Current values: startDate=${startDate}, endDate=${endDate}, dateDelimiter=${dateDelimiter}`,
  //   );
  // }

  // eslint-disable-next-line func-style
  const scroll: AppContext["scroll"] = function scroll({
    toDate,
    fromDate,
    behavior,
    // TODO type: 'top' | 'bottom' | 'center'
  }) {
    // state should be pushed to url search params so that user should be able to go back to previous position
    // so before doing this current position should be saved to url search params
    // also this function should be used for jump to date user functionality

    const newStartDate = roundDateToHours(toDate - preloadDateInterval);
    const newEndDate = roundDateToHours(toDate + preloadDateInterval);
    setStartDate(newStartDate);
    setEndDate(newEndDate);

    setTimeout(() => {
      if (behavior === "smooth" && fromDate) {
        scrollableContainerRef.current?.scrollTo({
          top: dateToY(fromDate, { startDate: newStartDate }),
          behavior: "instant",
        });
      }
      scrollableContainerRef.current?.scrollTo({
        top: dateToY(toDate, { startDate: newStartDate }),
        ...(behavior ? { behavior } : {}),
      });
    });
  };

  if (bookingsQuery.isPending) {
    return <>Loading...</>;
  }
  if (bookingsQuery.isError) {
    return <>{bookingsQuery.error.message}</>;
  }
  if (assetsQuery.isPending) {
    return <>Loading...</>;
  }
  if (assetsQuery.isError) {
    return <>{assetsQuery.error.message}</>;
  }

  return (
    <appContext.Provider
      value={{
        startDate,
        setStartDate,
        endDate,
        setEndDate,
        dateDelimiter,
        setDateDelimiter,
        dates,
        columnsSizes,
        setColumnsSizes,
        dateItemHeight,
        setDateItemHeight,
        dateToY,
        scrollPositionMs,
        scroll,
        assets: assetsQuery.data,
        bookings: bookingsQuery.data,
        scrollableContainerHeight,
        scrollableContainerRef,
        preloadDateInterval,
        setPreloadDateInterval,
      }}
    >
      {children}
    </appContext.Provider>
  );
}
