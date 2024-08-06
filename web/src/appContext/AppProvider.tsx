import { useLayoutEffect, useRef, useState } from "react";

import {
  DAY_IN_MS,
  getDates,
  getDefaultStartDate,
  HOUR_IN_MS,
} from "@/getDates";
import { trpc } from "@/trpc";

import { appContext } from "./app";

export function AppProvider({ children }: { children: React.ReactNode }) {
  const assetsQuery = trpc.assets.list.useQuery();
  const bookingsQuery = trpc.bookings.list.useQuery();

  const [dateItemHeight, setDateItemHeight] = useState(50);
  const [columnsSizes, setColumnsSizes] = useState<number[]>([]);

  const [preloadDateInterval, _setPreloadDateInterval] = useState(DAY_IN_MS);
  const [dateDelimiter, setDateDelimiter] = useState(HOUR_IN_MS);
  const [startDate, setStartDate] = useState(getDefaultStartDate);
  const [endDate, setEndDate] = useState(startDate + DAY_IN_MS);
  // const minPreloadDateInterval =
  //   (window.outerHeight / dateItemHeight) * dateDelimiter;

  const dates = getDates(startDate, endDate, dateDelimiter);
  const scrollableContainerHeight = dates.length * dateItemHeight;

  function dateToY(ts: number) {
    // startDate -> 0 (pixels)
    // endDate -> scrollHeight (pixels)
    // x -> (x - startDate) * scrollHeight / (endDate - startDate) (pixels)
    return ((ts - startDate) * dateItemHeight) / dateDelimiter;
  }

  const scrollableContainerRef = useRef<HTMLDivElement | null>(null);
  const scrollToDateRef = useRef<number | null>(null);
  useLayoutEffect(() => {
    if (scrollToDateRef.current !== null && scrollableContainerRef.current) {
      scrollableContainerRef.current.scrollTo({
        top: dateToY(scrollToDateRef.current),
      });
      scrollToDateRef.current = null;
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [scrollToDateRef.current]);

  // if ((endDate - startDate) % dateDelimiter !== 0) {
  //   // eslint-disable-next-line no-console
  //   console.log((endDate - startDate) % dateDelimiter);
  //   console.error(
  //     `Error: (endDate - startDate) should be always dividable by dateDelimiter. Current values: startDate=${startDate}, endDate=${endDate}, dateDelimiter=${dateDelimiter}`,
  //   );
  // }

  function scrollToDate(ts: number) {
    // const maxStartDate = roundDateToHours(ts - preloadDateInterval);
    // const minEndDate = roundDateToHours(ts + preloadDateInterval);
    // setStartDate(Math.min(maxStartDate, startDate));
    // setEndDate(Math.max(minEndDate, endDate));

    // TODO fix when used to scroll to newly created booking
    if (endDate - ts <= dateDelimiter) {
      setEndDate(ts + preloadDateInterval);
      scrollToDateRef.current = ts;
    } else if (ts <= startDate) {
      setStartDate(ts);
      scrollToDateRef.current = ts;
    } else {
      if (!scrollableContainerRef.current) return;
      scrollableContainerRef.current.scrollTo({
        top: dateToY(ts),
      });
    }
  }

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
        scrollToDate,
        assets: assetsQuery.data,
        bookings: bookingsQuery.data,
        scrollableContainerHeight,
        scrollableContainerRef,
      }}
    >
      {children}
    </appContext.Provider>
  );
}
