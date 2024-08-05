import { useState } from "react";

import { DAY_IN_MS, getDefaultStartDate } from "@/getDates";
import { trpc } from "@/trpc";

import { appContext } from "./app";

export function AppProvider({ children }: { children: React.ReactNode }) {
  const [dateItemHeight, setDateItemHeight] = useState(50);
  const [scrollHeight, setScrollHeight] = useState(0);
  const [columnsSizes, setColumnsSizes] = useState<number[]>([]);

  const [startDate, setStartDate] = useState(getDefaultStartDate);
  const [endDate, setEndDate] = useState(startDate + DAY_IN_MS);

  const assetsQuery = trpc.assets.list.useQuery();
  const bookingsQuery = trpc.bookings.list.useQuery();

  function dateToY(ts: number) {
    // startDate -> 0 (pixels)
    // endDate -> scrollHeight (pixels)
    // x -> (x - startDate) * scrollHeight / (endDate - startDate) (pixels)
    return ((ts - startDate) * scrollHeight) / (endDate - startDate);
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
        columnsSizes,
        setColumnsSizes,
        dateItemHeight,
        setDateItemHeight,
        scrollHeight,
        setScrollHeight,
        dateToY,
        assets: assetsQuery.data,
        bookings: bookingsQuery.data,
      }}
    >
      {children}
    </appContext.Provider>
  );
}
